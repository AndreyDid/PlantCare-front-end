'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	ArrowLeft,
	CalendarDays,
	Copy,
	Droplets,
	Flower2,
	Leaf,
	MapPin,
	Sprout,
	Timer
} from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/src/components/ui/buttons/Button'
import { Field } from '@/src/components/ui/fields/Field'
import { Modal } from '@/src/components/ui/modal/Modal'
import { DASHBOARD_PAGES } from '@/src/config/pages-url.config'
import {
	useGetUserPlantsById,
	useUpdateUserPlant
} from '@/src/hooks/userPlants'
import { userPlantService } from '@/src/services/userPlant.service'
import type {
	CreateUserPlant,
	GetUserPlantById,
	UpdateUserPlant
} from '@/src/types/plants.types'

function formatDate(date?: string | null) {
	if (!date) return 'Не указано'

	const parsedDate = new Date(date)

	if (Number.isNaN(parsedDate.getTime())) return 'Не указано'

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	}).format(parsedDate)
}

function toDateInputValue(date?: string | null) {
	if (!date) return ''

	const parsedDate = new Date(date)

	if (Number.isNaN(parsedDate.getTime())) return ''

	return parsedDate.toISOString().slice(0, 10)
}

function toIsoDate(date?: string | null) {
	if (!date) return null

	return new Date(date).toISOString()
}

function nullableString(value?: string | number | null) {
	if (value === null || value === undefined) return null

	const normalizedValue = String(value).trim()

	return normalizedValue ? normalizedValue : null
}

function getPlantFormValues(plant?: GetUserPlantById | null): UpdateUserPlant {
	if (!plant) return {}

	return {
		...plant,
		photoUrl: plant.photoUrl ?? '',
		location: plant.location ?? '',
		fertilizingIntervalDays: plant.fertilizingIntervalDays ?? undefined,
		wateringIntervalDays: plant.wateringIntervalDays ?? undefined,
		wateringIntervalSpringDays: plant.wateringIntervalSpringDays ?? undefined,
		wateringIntervalSummerDays: plant.wateringIntervalSummerDays ?? undefined,
		wateringIntervalAutumnDays: plant.wateringIntervalAutumnDays ?? undefined,
		wateringIntervalWinterDays: plant.wateringIntervalWinterDays ?? undefined,
		potSize: plant.potSize ?? '',
		potType: plant.potType ?? '',
		soilType: plant.soilType ?? '',
		lastFertilizedAt: toDateInputValue(plant.lastFertilizedAt),
		nextFertilizingAt: toDateInputValue(plant.nextFertilizingAt),
		lastRepottedAt: toDateInputValue(plant.lastRepottedAt),
		nextRepottingAt: toDateInputValue(plant.nextRepottingAt),
		lastWateredAt: toDateInputValue(plant.lastWateredAt),
		nextWateringAt: toDateInputValue(plant.nextWateringAt)
	}
}

type DuplicatePlantForm = Pick<CreateUserPlant, 'photoUrl' | 'location'>

function getDuplicatePlantValues(
	plant?: GetUserPlantById | null
): DuplicatePlantForm {
	return {
		photoUrl: plant?.photoUrl ?? '',
		location: plant?.location ?? ''
	}
}

function getDuplicatePlantPayload(
	plant: GetUserPlantById,
	formValues: DuplicatePlantForm
): CreateUserPlant {
	return {
		plantName: plant.plantName,
		nickname: plant.nickname,
		location: nullableString(formValues.location),
		photoUrl: nullableString(formValues.photoUrl),
		plantTypeId: plant.plantTypeId,
		lightLevel: plant.lightLevel,
		temperatureMin: plant.temperatureMin,
		temperatureMax: plant.temperatureMax,
		humidityMin: plant.humidityMin,
		humidityMax: plant.humidityMax,
		potType: plant.potType,
		potSize: plant.potSize,
		soilType: plant.soilType,
		lastRepottedAt: null,
		nextRepottingAt: null,
		lastWateredAt: null,
		nextWateringAt: null,
		wateringIntervalDays: plant.wateringIntervalDays,
		wateringIntervalSpringDays: plant.wateringIntervalSpringDays,
		wateringIntervalSummerDays: plant.wateringIntervalSummerDays,
		wateringIntervalAutumnDays: plant.wateringIntervalAutumnDays,
		wateringIntervalWinterDays: plant.wateringIntervalWinterDays,
		wateringAmountMl: plant.wateringAmountMl,
		fertilizingIntervalDays: plant.fertilizingIntervalDays,
		lastFertilizedAt: null,
		nextFertilizingAt: null
	}
}

function nullableNumber(value?: string | number | null) {
	if (value === '' || value === null || value === undefined) return null

	const numberValue = Number(value)

	return Number.isFinite(numberValue) ? numberValue : null
}

type WateringIntervalFields = Pick<
	UpdateUserPlant,
	| 'wateringIntervalDays'
	| 'wateringIntervalSpringDays'
	| 'wateringIntervalSummerDays'
	| 'wateringIntervalAutumnDays'
	| 'wateringIntervalWinterDays'
>

function getPositiveNumber(value?: string | number | null) {
	const numberValue = nullableNumber(value)

	return numberValue && numberValue > 0 ? numberValue : null
}

function getSeasonByDate(date: Date) {
	const month = date.getUTCMonth()

	if (month >= 2 && month <= 4) return 'spring'
	if (month >= 5 && month <= 7) return 'summer'
	if (month >= 8 && month <= 10) return 'autumn'

	return 'winter'
}

function getSeasonalWateringIntervalDays(
	date: Date,
	intervals: WateringIntervalFields
) {
	const season = getSeasonByDate(date)
	const baseInterval = getPositiveNumber(intervals.wateringIntervalDays)

	if (season === 'spring') {
		return (
			getPositiveNumber(intervals.wateringIntervalSpringDays) ?? baseInterval
		)
	}

	if (season === 'summer') {
		return (
			getPositiveNumber(intervals.wateringIntervalSummerDays) ?? baseInterval
		)
	}

	if (season === 'autumn') {
		return (
			getPositiveNumber(intervals.wateringIntervalAutumnDays) ?? baseInterval
		)
	}

	if (season === 'winter') {
		return (
			getPositiveNumber(intervals.wateringIntervalWinterDays) ?? baseInterval
		)
	}

	return baseInterval
}

function addDays(date: Date, days: number) {
	const nextDate = new Date(date)

	nextDate.setUTCDate(nextDate.getUTCDate() + days)

	return nextDate
}

function getNextWateringByInterval(
	wateredAt: Date,
	intervals: WateringIntervalFields
) {
	const intervalDays = getSeasonalWateringIntervalDays(wateredAt, intervals)

	return intervalDays ? addDays(wateredAt, intervalDays).toISOString() : null
}

function getNextWateringInputDate(
	lastWateredAt: string | null | undefined,
	intervals: WateringIntervalFields
) {
	if (!lastWateredAt) return ''

	const wateredAt = new Date(lastWateredAt)

	if (Number.isNaN(wateredAt.getTime())) return ''

	return toDateInputValue(getNextWateringByInterval(wateredAt, intervals))
}

function formatWateringInterval(plant: GetUserPlantById) {
	const intervalDays = getSeasonalWateringIntervalDays(new Date(), plant)

	return intervalDays ? `${intervalDays} дн.` : 'Не указано'
}

function formatIntervalDays(value?: number | string | null) {
	const intervalDays = getPositiveNumber(value)

	return intervalDays ? `${intervalDays} дн.` : 'Не указано'
}

function getWateringSeasonItems(plant: GetUserPlantById) {
	return [
		{
			label: 'Весна',
			value: plant.wateringIntervalSpringDays ?? plant.wateringIntervalDays
		},
		{
			label: 'Лето',
			value: plant.wateringIntervalSummerDays ?? plant.wateringIntervalDays
		},
		{
			label: 'Осень',
			value: plant.wateringIntervalAutumnDays ?? plant.wateringIntervalDays
		},
		{
			label: 'Зима',
			value: plant.wateringIntervalWinterDays ?? plant.wateringIntervalDays
		}
	]
}

function getNextWateringDate(
	wateredAt: Date,
	lastWateredAt?: string | null,
	nextWateringAt?: string | null
) {
	if (!nextWateringAt) return null

	const previousNextWatering = new Date(nextWateringAt)

	if (Number.isNaN(previousNextWatering.getTime())) return null

	if (!lastWateredAt) {
		return previousNextWatering > wateredAt
			? previousNextWatering.toISOString()
			: null
	}

	const previousLastWatering = new Date(lastWateredAt)

	if (
		Number.isNaN(previousLastWatering.getTime()) ||
		previousNextWatering <= previousLastWatering
	) {
		return previousNextWatering > wateredAt
			? previousNextWatering.toISOString()
			: null
	}

	const wateringInterval =
		previousNextWatering.getTime() - previousLastWatering.getTime()

	return new Date(wateredAt.getTime() + wateringInterval).toISOString()
}

function PlantViewSkeleton() {
	return (
		<div className='w-full max-w-7xl'>
			<div className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8'>
				<div className='mb-8 h-10 w-36 rounded-2xl bg-white/10' />
				<div className='grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)]'>
					<div className='h-[420px] animate-pulse rounded-[28px] bg-white/10' />
					<div className='space-y-4'>
						<div className='h-4 w-28 rounded-full bg-white/10' />
						<div className='h-10 w-3/4 rounded-full bg-white/10' />
						<div className='h-24 rounded-[24px] bg-white/10' />
						<div className='grid grid-cols-2 gap-3'>
							<div className='h-32 rounded-[24px] bg-white/10' />
							<div className='h-32 rounded-[24px] bg-white/10' />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export function UserPlantViewPage() {
	const params = useParams()
	const router = useRouter()
	const queryClient = useQueryClient()
	const id = String(params.id)
	const [isDuplicateOpen, setIsDuplicateOpen] = useState(false)

	const { data, isLoading } = useGetUserPlantsById(id)

	const { register, handleSubmit, reset, setValue, control } =
		useForm<UpdateUserPlant>()
	const {
		register: registerDuplicate,
		handleSubmit: handleDuplicateSubmit,
		reset: resetDuplicate
	} = useForm<DuplicatePlantForm>()

	const mutate = useUpdateUserPlant(id)
	const duplicateMutation = useMutation({
		mutationKey: ['duplicatePlant', id],
		mutationFn: (formValues: DuplicatePlantForm) => {
			if (!data) {
				throw new Error('Plant not found')
			}

			return userPlantService.create(getDuplicatePlantPayload(data, formValues))
		},
		onSuccess: newPlant => {
			toast.success('Растение скопировано')
			queryClient.invalidateQueries({
				queryKey: ['userPlants']
			})
			setIsDuplicateOpen(false)
			resetDuplicate(getDuplicatePlantValues(newPlant))
			router.push(DASHBOARD_PAGES.PLANT(newPlant.id))
		}
	})
	const [
		lastWateredAt,
		wateringIntervalDays,
		wateringIntervalSpringDays,
		wateringIntervalSummerDays,
		wateringIntervalAutumnDays,
		wateringIntervalWinterDays
	] = useWatch({
		control,
		name: [
			'lastWateredAt',
			'wateringIntervalDays',
			'wateringIntervalSpringDays',
			'wateringIntervalSummerDays',
			'wateringIntervalAutumnDays',
			'wateringIntervalWinterDays'
		]
	})

	useEffect(() => {
		reset(getPlantFormValues(data))
	}, [reset, data])

	useEffect(() => {
		resetDuplicate(getDuplicatePlantValues(data))
	}, [resetDuplicate, data])

	useEffect(() => {
		const nextWateringAt = getNextWateringInputDate(lastWateredAt, {
			wateringIntervalDays,
			wateringIntervalSpringDays,
			wateringIntervalSummerDays,
			wateringIntervalAutumnDays,
			wateringIntervalWinterDays
		})

		if (nextWateringAt) {
			setValue('nextWateringAt', nextWateringAt, {
				shouldDirty: true
			})
		}
	}, [
		lastWateredAt,
		setValue,
		wateringIntervalDays,
		wateringIntervalSpringDays,
		wateringIntervalSummerDays,
		wateringIntervalAutumnDays,
		wateringIntervalWinterDays
	])

	const handleCancel = () => {
		reset(getPlantFormValues(data))
	}

	const openDuplicateModal = () => {
		resetDuplicate(getDuplicatePlantValues(data))
		setIsDuplicateOpen(true)
	}

	const closeDuplicateModal = () => {
		if (duplicateMutation.isPending) return

		setIsDuplicateOpen(false)
		resetDuplicate(getDuplicatePlantValues(data))
	}

	const onDuplicateSubmit = handleDuplicateSubmit(formValues => {
		duplicateMutation.mutate(formValues)
	})

	const onSubmit = handleSubmit(data => {
		const nextWateringAt =
			getNextWateringInputDate(data.lastWateredAt, data) || data.nextWateringAt

		mutate.mutateAsync({
			...data,
			photoUrl: nullableString(data.photoUrl),
			location: nullableString(data.location),
			fertilizingIntervalDays: nullableNumber(data.fertilizingIntervalDays),
			wateringIntervalDays: nullableNumber(data.wateringIntervalDays),
			wateringIntervalSpringDays: nullableNumber(
				data.wateringIntervalSpringDays
			),
			wateringIntervalSummerDays: nullableNumber(
				data.wateringIntervalSummerDays
			),
			wateringIntervalAutumnDays: nullableNumber(
				data.wateringIntervalAutumnDays
			),
			wateringIntervalWinterDays: nullableNumber(
				data.wateringIntervalWinterDays
			),
			potSize: nullableString(data.potSize),
			potType: nullableString(data.potType),
			soilType: nullableString(data.soilType),
			lastFertilizedAt: toIsoDate(data.lastFertilizedAt),
			nextFertilizingAt: toIsoDate(data.nextFertilizingAt),
			lastRepottedAt: toIsoDate(data.lastRepottedAt),
			nextRepottingAt: toIsoDate(data.nextRepottingAt),
			lastWateredAt: toIsoDate(data.lastWateredAt),
			nextWateringAt: toIsoDate(nextWateringAt)
		})
	})

	const handleWaterNow = async () => {
		if (!data || mutate.isPending) return

		const wateredAt = new Date()
		const nextWateringAt =
			getNextWateringByInterval(wateredAt, data) ??
			getNextWateringDate(wateredAt, data.lastWateredAt, data.nextWateringAt)

		const updatedPlant = await mutate.mutateAsync({
			lastWateredAt: wateredAt.toISOString(),
			nextWateringAt
		})

		reset(getPlantFormValues(updatedPlant))
	}

	if (isLoading) return <PlantViewSkeleton />

	if (!data) {
		return (
			<div className='w-full max-w-7xl'>
				<div className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl'>
					<div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-200'>
						<Sprout size={24} />
					</div>
					<h1 className='text-2xl font-semibold text-white'>
						Растение не найдено
					</h1>
					<p className='mx-auto mt-3 max-w-md text-sm leading-6 text-white/60'>
						Проверьте список растений или вернитесь к коллекции.
					</p>
					<button
						type='button'
						className='mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10'
						onClick={() => router.back()}
					>
						<ArrowLeft size={18} />
						Назад
					</button>
				</div>
			</div>
		)
	}

	const title = data.nickname || data.plantName || 'Без названия'
	const subtitle = data.plantName || 'Комнатное растение'

	return (
		<div className='w-full max-w-7xl'>
			<section className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8 '>
				<div className='mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<p className='mb-3 text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
							Plant Profile
						</p>
						<h1 className='text-2xl font-semibold text-white sm:text-3xl'>
							{title}
						</h1>
					</div>
					<div className='flex flex-col gap-3 sm:flex-row'>
						<button
							type='button'
							className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-5 py-3 text-sm font-medium text-emerald-50 transition hover:bg-emerald-300/15 sm:w-auto'
							onClick={openDuplicateModal}
						>
							<Copy size={18} />
							Скопировать
						</button>
						<button
							type='button'
							className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto'
							onClick={() => router.back()}
						>
							<ArrowLeft size={18} />
							Назад
						</button>
					</div>
				</div>

				<div className='flex flex-col gap-8'>
					<div className='grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)]'>
						<div className='relative min-h-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-black/15 shadow-[0_16px_46px_rgba(0,0,0,0.22)] sm:min-h-[460px]'>
							{data.photoUrl ? (
								<Image
									src={data.photoUrl}
									alt={title}
									fill
									unoptimized
									sizes='(max-width: 1024px) 100vw, 720px'
									className='object-cover'
								/>
							) : (
								<div className='flex h-full min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,rgba(142,229,143,0.18),rgba(255,255,255,0.05))] text-emerald-100 sm:min-h-[460px]'>
									<Flower2 size={86} />
								</div>
							)}
							<div className='absolute left-4 top-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#07110d]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-emerald-100/70 backdrop-blur-xl'>
								<Leaf size={16} />
								Мое растение
							</div>
						</div>

						<div className='flex flex-col'>
							<div className='rounded-[28px] border border-white/10 bg-black/15 p-5'>
								<p className='mb-3 text-[11px] uppercase tracking-[0.28em] text-emerald-100/55'>
									Вид
								</p>
								<p className='text-xl font-semibold text-white'>{subtitle}</p>
								{data.location ? (
									<p className='mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-100/75'>
										<MapPin size={16} />
										{data.location}
									</p>
								) : null}
								<p className='mt-3 text-sm leading-6 text-white/55'>
									Карточка растения из вашей коллекции с датами ухода и
									ближайшим поливом.
								</p>
							</div>

							<div className='mt-4 rounded-[28px] border border-emerald-200/15 bg-emerald-300/10 p-5'>
								<div className='flex items-center gap-4'>
									<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-300 text-slate-950'>
										<Droplets size={22} />
									</div>
									<div>
										<p className='text-[11px] uppercase tracking-[0.28em] text-emerald-100/60'>
											Следующий полив
										</p>
										<p className='mt-1 text-lg font-semibold text-white'>
											{formatDate(data.nextWateringAt)}
										</p>
									</div>
								</div>
							</div>

							<div className='mt-4 grid gap-3 sm:grid-cols-2'>
								<div className='rounded-[24px] border border-white/10 bg-white/5 p-4'>
									<Droplets
										size={22}
										className='text-emerald-200'
									/>
									<p className='mt-4 text-[11px] uppercase tracking-[0.24em] text-white/45'>
										Последний полив
									</p>
									<p className='mt-2 text-sm font-semibold leading-6 text-white'>
										{formatDate(data.lastWateredAt)}
									</p>
								</div>

								<div className='rounded-[24px] border border-white/10 bg-white/5 p-4'>
									<Timer
										size={22}
										className='text-emerald-200'
									/>
									<p className='mt-4 text-[11px] uppercase tracking-[0.24em] text-white/45'>
										Интервал
									</p>
									<p className='mt-2 text-sm font-semibold leading-6 text-white'>
										{formatWateringInterval(data)}
									</p>
								</div>

								<div className='rounded-[24px] border border-white/10 bg-white/5 p-4'>
									<CalendarDays
										size={22}
										className='text-emerald-200'
									/>
									<p className='mt-4 text-[11px] uppercase tracking-[0.24em] text-white/45'>
										Добавлено
									</p>
									<p className='mt-2 text-sm font-semibold leading-6 text-white'>
										{formatDate(data.createdAt)}
									</p>
								</div>
							</div>

							<div className='mt-4 rounded-[24px] border border-white/10 bg-white/5 p-4'>
								<p className='text-[11px] uppercase tracking-[0.24em] text-white/45'>
									Полив по сезонам
								</p>
								<div className='mt-4 grid grid-cols-2 gap-3'>
									{getWateringSeasonItems(data).map(item => (
										<div
											key={item.label}
											className='rounded-2xl border border-white/8 bg-black/10 p-3'
										>
											<p className='text-xs text-white/50'>{item.label}</p>
											<p className='mt-1 text-sm font-semibold text-white'>
												{formatIntervalDays(item.value)}
											</p>
										</div>
									))}
								</div>
							</div>

							<button
								type='button'
								onClick={handleWaterNow}
								disabled={mutate.isPending}
								className='mt-6 inline-flex w-full items-center justify-center gap-3 rounded-[20px] border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3.5 text-base font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] transition hover:-translate-y-0.5 hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed disabled:opacity-70'
							>
								<Droplets size={20} />
								Полить сейчас
							</button>
						</div>
					</div>

					<div className='rounded-[24px] border border-white/10 bg-white/5 p-4'>
						<form onSubmit={onSubmit}>
							<Field
								id='plantName'
								label='Название растения'
								placeholder='Например, Monstera Deliciosa'
								type='text'
								extra='mb-4'
								{...register('plantName', {
									required: 'Поле обязательно для заполнения'
								})}
							/>
							<Field
								id='nickname'
								label='Домашнее имя'
								placeholder='Например, Зелёный сосед'
								type='text'
								extra='mb-6'
								{...register('nickname', {
									required: 'Поле обязательно для заполнения'
								})}
							/>
							<Field
								id='location'
								label='Локация'
								placeholder='Например, кухня, окно в спальне'
								type='text'
								extra='mb-6'
								{...register('location')}
							/>
							<Field
								id='photoUrl'
								label='URL фотографии'
								placeholder='Ссылка на фото растения'
								type='text'
								extra='mb-6'
								{...register('photoUrl')}
							/>
							{/* <Field
								id='plantTypeId'
								label='ID типа растения'
								placeholder='Укажите ID типа растения'
								type='string'
								extra='mb-6'
								isNumber
								{...register('plantTypeId', {
									setValueAs: nullableNumber
								})}
							/> */}
							<Field
								id='lightLevel'
								label='Свет'
								placeholder='Укажите свет для растения'
								type='text'
								extra='mb-6'
								{...register('lightLevel')}
							/>
							{/* <Field
								id='fertilizingIntervalDays'
								label='Интервал удобрения'
								placeholder='Например, 14 дней'
								type='number'
								extra='mb-6'
								{...register('fertilizingIntervalDays', {
									setValueAs: nullableNumber
								})}
							/> */}
							<Field
								id='fertilizingIntervalDays'
								label='Интервал удобрения'
								placeholder='Например, 14 дней'
								type='number'
								extra='mb-6'
								isNumber
								{...register('fertilizingIntervalDays', {
									setValueAs: nullableNumber
								})}
							/>
							<Field
								id='lastFertilizedAt'
								label='Дата последнего удобрения'
								placeholder='Дата последнего удобрения'
								type='date'
								extra='mb-6'
								{...register('lastFertilizedAt')}
							/>
							<Field
								id='nextFertilizingAt'
								label='Дата следующего удобрения'
								placeholder='Дата следующего удобрения'
								type='date'
								extra='mb-6'
								{...register('nextFertilizingAt')}
							/>
							<Field
								id='lastRepottedAt'
								label='Дата последней пересадки'
								placeholder='Дата последней пересадки'
								type='date'
								extra='mb-6'
								{...register('lastRepottedAt')}
							/>
							<Field
								id='nextRepottingAt'
								label='Дата следующей пересадки'
								placeholder='Дата следующей пересадки'
								type='date'
								extra='mb-6'
								{...register('nextRepottingAt')}
							/>
							<Field
								id='humidityMin'
								label='Минимальная влажность'
								placeholder='Минимальная влажность, %'
								type='number'
								extra='mb-6'
								isNumber
								{...register('humidityMin', {
									setValueAs: nullableNumber
								})}
							/>
							<Field
								id='humidityMax'
								label='Максимальная влажность'
								placeholder='Максимальная влажность, %'
								type='number'
								extra='mb-6'
								isNumber
								{...register('humidityMax', {
									setValueAs: nullableNumber
								})}
							/>
							<Field
								id='potSize'
								label='Размер горшка'
								placeholder='Например, 12 см'
								type='text'
								extra='mb-6'
								{...register('potSize')}
							/>
							<Field
								id='potType'
								label='Тип горшка'
								placeholder='Например, керамический'
								type='text'
								extra='mb-6'
								{...register('potType')}
							/>
							<Field
								id='soilType'
								label='Тип почвы'
								placeholder='Например, универсальный грунт'
								type='text'
								extra='mb-6'
								{...register('soilType')}
							/>
							<Field
								id='temperatureMin'
								label='Минимальная температура'
								placeholder='Минимальная температура, °C'
								type='number'
								extra='mb-6'
								isNumber
								{...register('temperatureMin', {
									setValueAs: nullableNumber
								})}
							/>
							<Field
								id='temperatureMax'
								label='Максимальная температура'
								placeholder='Максимальная температура, °C'
								type='number'
								extra='mb-6'
								isNumber
								{...register('temperatureMax', {
									setValueAs: nullableNumber
								})}
							/>
							<Field
								id='wateringAmountMl'
								label='Объем полива'
								placeholder='Объем полива, мл'
								type='number'
								extra='mb-6'
								isNumber
								{...register('wateringAmountMl', {
									setValueAs: nullableNumber
								})}
							/>
							<Field
								id='lastWateredAt'
								label='Дата последнего полива'
								placeholder='Дата последнего полива'
								type='date'
								extra='mb-6'
								{...register('lastWateredAt')}
							/>
							<Field
								id='wateringIntervalDays'
								label='Базовый интервал полива'
								placeholder='Например, 7 дней'
								type='number'
								min={1}
								extra='mb-6'
								isNumber
								{...register('wateringIntervalDays', {
									setValueAs: nullableNumber
								})}
							/>
							<Field
								id='wateringIntervalSummerDays'
								label='Летний интервал полива'
								placeholder='Например, 5 дней'
								type='number'
								min={1}
								extra='mb-6'
								isNumber
								{...register('wateringIntervalSummerDays', {
									setValueAs: nullableNumber
								})}
							/>
							<Field
								id='wateringIntervalSpringDays'
								label='Весенний интервал полива'
								placeholder='Например, 7 дней'
								type='number'
								min={1}
								extra='mb-6'
								isNumber
								{...register('wateringIntervalSpringDays', {
									setValueAs: nullableNumber
								})}
							/>
							<Field
								id='wateringIntervalAutumnDays'
								label='Осенний интервал полива'
								placeholder='Например, 12 дней'
								type='number'
								min={1}
								extra='mb-6'
								isNumber
								{...register('wateringIntervalAutumnDays', {
									setValueAs: nullableNumber
								})}
							/>
							<Field
								id='wateringIntervalWinterDays'
								label='Зимний интервал полива'
								placeholder='Например, 10 дней'
								type='number'
								min={1}
								extra='mb-6'
								isNumber
								{...register('wateringIntervalWinterDays', {
									setValueAs: nullableNumber
								})}
							/>
							<Field
								id='nextWateringAt'
								label='Дата следующего полива'
								placeholder='Дата следующего полива'
								type='date'
								extra='mb-6'
								{...register('nextWateringAt')}
							/>
							<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
								<Button
									type='button'
									className='rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-white hover:bg-white/10'
									onClick={handleCancel}
								>
									Отмена
								</Button>
								<Button
									type='submit'
									disabled={mutate.isPending}
									className='rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed disabled:opacity-70'
								>
									{mutate.isPending ? 'Сохраняем...' : 'Сохранить'}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</section>
			<Modal
				isOpen={isDuplicateOpen}
				onClose={closeDuplicateModal}
				title='Скопировать растение'
				titleId='duplicate-plant-title'
				eyebrow='Duplicate Plant'
				description='Будет создано новое растение с такими же параметрами ухода. Здесь можно изменить только фото и место.'
				closeLabel='Закрыть окно'
				closeOnOverlayClick={!duplicateMutation.isPending}
			>
				<form onSubmit={onDuplicateSubmit}>
					<Field
						id='duplicatePhotoUrl'
						label='URL фотографии'
						placeholder='Ссылка на фото нового растения'
						type='text'
						extra='mb-4'
						{...registerDuplicate('photoUrl')}
					/>
					<Field
						id='duplicateLocation'
						label='Локация'
						placeholder='Например, кухня, окно в спальне'
						type='text'
						extra='mb-6'
						{...registerDuplicate('location')}
					/>
					<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
						<Button
							type='button'
							className='rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-white hover:bg-white/10'
							onClick={closeDuplicateModal}
							disabled={duplicateMutation.isPending}
						>
							Отмена
						</Button>
						<Button
							type='submit'
							disabled={duplicateMutation.isPending}
							className='rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed disabled:opacity-70'
						>
							{duplicateMutation.isPending ? 'Создаем...' : 'Создать копию'}
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	)
}
