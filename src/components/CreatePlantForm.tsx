'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useUserProfile } from '../hooks/userProfile'
import { userPlantService } from '../services/userPlant.service'
import { CreateUserPlant, PlantAiSuggestion } from '../types/plants.types'

import { PlantAiSuggestionCard } from './PlantAiSuggestionCard'
import { Button } from './ui/buttons/Button'
import { Field } from './ui/fields/Field'
import { Modal } from './ui/modal/Modal'

function nullableNumber(value?: string | number | null) {
	if (value === '' || value === null || value === undefined) return null

	const numberValue = Number(value)

	return Number.isFinite(numberValue) ? numberValue : null
}

function nullableString(value?: string | number | null) {
	if (value === null || value === undefined) return null

	const normalizedValue = String(value).trim()

	return normalizedValue ? normalizedValue : null
}

const aiSuggestionFields: Array<keyof CreateUserPlant> = [
	'plantName',
	'lightLevel',
	'temperatureMin',
	'temperatureMax',
	'humidityMin',
	'humidityMax',
	'potType',
	'potSize',
	'soilType',
	'wateringIntervalDays',
	'wateringIntervalSpringDays',
	'wateringIntervalSummerDays',
	'wateringIntervalAutumnDays',
	'wateringIntervalWinterDays',
	'wateringAmountMl',
	'wateringNotes',
	'fertilizingIntervalDays'
]

function normalizeCreatePayload(data: CreateUserPlant): CreateUserPlant {
	return {
		...data,
		plantName: nullableString(data.plantName) ?? '',
		nickname: nullableString(data.nickname) ?? '',
		location: nullableString(data.location),
		photoUrl: nullableString(data.photoUrl),
		lightLevel: nullableString(data.lightLevel),
		potType: nullableString(data.potType),
		potSize: nullableString(data.potSize),
		soilType: nullableString(data.soilType),
		wateringNotes: nullableString(data.wateringNotes),
		temperatureMin: nullableNumber(data.temperatureMin),
		temperatureMax: nullableNumber(data.temperatureMax),
		humidityMin: nullableNumber(data.humidityMin),
		humidityMax: nullableNumber(data.humidityMax),
		wateringIntervalDays: nullableNumber(data.wateringIntervalDays),
		wateringIntervalSpringDays: nullableNumber(data.wateringIntervalSpringDays),
		wateringIntervalSummerDays: nullableNumber(data.wateringIntervalSummerDays),
		wateringIntervalAutumnDays: nullableNumber(data.wateringIntervalAutumnDays),
		wateringIntervalWinterDays: nullableNumber(data.wateringIntervalWinterDays),
		wateringAmountMl: nullableNumber(data.wateringAmountMl),
		fertilizingIntervalDays: nullableNumber(data.fertilizingIntervalDays)
	}
}

export function CreatePlantForm() {
	const [isOpen, setIsOpen] = useState(false)
	const [photoFile, setPhotoFile] = useState<File | null>(null)
	const [aiCity, setAiCity] = useState('')
	const [aiSuggestion, setAiSuggestion] = useState<PlantAiSuggestion | null>(
		null
	)
	const { data: profileData } = useUserProfile()
	const photoPreviewUrl = useMemo(
		() => (photoFile ? URL.createObjectURL(photoFile) : null),
		[photoFile]
	)
	const { register, handleSubmit, reset, getValues, setValue } =
		useForm<CreateUserPlant>()
	const queryClient = useQueryClient()

	const closeModal = () => {
		setIsOpen(false)
		setPhotoFile(null)
		setAiCity('')
		setAiSuggestion(null)
		reset()
	}

	useEffect(() => {
		return () => {
			if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
		}
	}, [photoPreviewUrl])

	const { mutate, isPending } = useMutation({
		mutationKey: ['createPlant'],
		mutationFn: async (data: CreateUserPlant) => {
			const photoUrl = photoFile
				? await userPlantService.uploadPhoto(photoFile)
				: data.photoUrl

			return userPlantService.create(
				normalizeCreatePayload({
					...data,
					photoUrl: nullableString(photoUrl)
				})
			)
		},
		onSuccess() {
			toast.success('Растение успешно добавлено')
			queryClient.invalidateQueries({
				queryKey: ['userPlants']
			})
			closeModal()
		}
	})

	const applyAiSuggestion = (result: PlantAiSuggestion) => {
		aiSuggestionFields.forEach(field => {
			const value = result.suggestion[field]

			if (value !== undefined) {
				setValue(field, value, {
					shouldDirty: true
				})
			}
		})

		const currentNickname = nullableString(getValues('nickname'))
		const suggestedName = nullableString(
			result.suggestion.plantName ?? result.plantName
		)

		if (!currentNickname && suggestedName) {
			setValue('nickname', suggestedName, {
				shouldDirty: true
			})
		}
	}

	const aiSuggestMutation = useMutation({
		mutationKey: ['suggestPlantCare'],
		mutationFn: async () => {
			const currentValues = getValues()
			const plantName = nullableString(currentValues.plantName)

			if (!plantName) {
				throw new Error('Введите название или вид растения')
			}

			return userPlantService.suggestCare({
				plantName,
				city: nullableString(aiCity),
				currentValues
			})
		},
		onSuccess(result) {
			setAiSuggestion(result)
			applyAiSuggestion(result)
			toast.success('ИИ заполнил черновик ухода')
		},
		onError(error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Не удалось получить подсказку от ИИ'
			)
		}
	})

	const onSubmit: SubmitHandler<CreateUserPlant> = data => {
		mutate(data)
	}

	return (
		<>
			<Button
				type='button'
				className='group flex w-full items-center justify-center gap-3 rounded-[20px] border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 text-base font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] transition hover:-translate-y-0.5 hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 sm:w-auto'
				onClick={() => {
					setAiCity(currentCity => currentCity || profileData?.user.city || '')
					setIsOpen(true)
				}}
			>
				<span className='flex items-center justify-center rounded-2xl text-slate-950 transition'>
					<Plus size={18} />
				</span>
				<span className='flex items-center gap-2'>Добавить растение</span>
			</Button>

			<Modal
				isOpen={isOpen}
				onClose={closeModal}
				title='Добавить растение'
				titleId='create-plant-title'
				eyebrow='New Plant'
				description='Заполните основные данные, проверьте подсказки ИИ и сохраните растение после подтверждения.'
				closeLabel='Закрыть окно'
				className='max-w-5xl'
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='grid gap-x-4 sm:grid-cols-2'>
						<Field
							id='plantName'
							label='Название или вид растения'
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
							placeholder='Например, Зеленый сосед'
							type='text'
							extra='mb-4'
							{...register('nickname', {
								required: 'Поле обязательно для заполнения'
							})}
						/>

						<Field
							id='location'
							label='Место дома'
							placeholder='Например, кухня, окно в спальне'
							type='text'
							extra='mb-4'
							{...register('location', {
								setValueAs: nullableString
							})}
						/>

						<Field
							id='aiCity'
							label='Город для учета погоды'
							placeholder='Например, Москва'
							type='text'
							extra='mb-4'
							value={aiCity}
							onChange={event => setAiCity(event.target.value)}
						/>
					</div>

					<div className='mb-5 rounded-[22px] border border-white/10 bg-white/[0.04] p-4'>
						<div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
							<div className='flex-1'>
								<p className='text-sm font-medium text-white/82'>
									ИИ может заполнить черновик по названию растения
								</p>
								<p className='mt-1 text-xs leading-5 text-white/52'>
									Поля ниже обновятся автоматически. Перед сохранением проверьте
									горшок, свет и влажность грунта вручную.
								</p>
							</div>
							<Button
								type='button'
								disabled={aiSuggestMutation.isPending}
								className='rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-4 py-3 text-emerald-50 hover:bg-emerald-300/15'
								onClick={() => aiSuggestMutation.mutate()}
							>
								<Sparkles size={17} />
								{aiSuggestMutation.isPending
									? 'Заполняем...'
									: 'Заполнить через ИИ'}
							</Button>
						</div>
						<PlantAiSuggestionCard
							suggestion={aiSuggestion}
							className='mt-4'
						/>
					</div>

					<div className='mb-4'>
						<label
							htmlFor='plantPhoto'
							className='ml-1.5 text-sm font-medium tracking-[0.02em] text-white/72'
						>
							Фото растения
						</label>
						<input
							id='plantPhoto'
							type='file'
							accept='image/*'
							capture='environment'
							className='mt-2 w-full rounded-[18px] border border-white/10 bg-white/6 px-4 py-3.5 text-base text-white outline-none transition duration-200 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-emerald-200 focus:border-emerald-300/70 focus:bg-white/8'
							onChange={event => {
								setPhotoFile(event.target.files?.[0] ?? null)
							}}
						/>
						{photoPreviewUrl ? (
							<div
								aria-hidden='true'
								className='mt-3 h-36 w-full rounded-2xl bg-cover bg-center'
								style={{ backgroundImage: `url(${photoPreviewUrl})` }}
							/>
						) : null}
					</div>

					<div className='grid gap-x-4 sm:grid-cols-2'>
						<Field
							id='lightLevel'
							label='Свет'
							placeholder='Например, яркий рассеянный свет'
							type='text'
							extra='mb-4'
							{...register('lightLevel', {
								setValueAs: nullableString
							})}
						/>
						<Field
							id='wateringAmountMl'
							label='Объем полива, мл'
							placeholder='Например, 300'
							type='number'
							min={1}
							extra='mb-4'
							isNumber
							{...register('wateringAmountMl', {
								setValueAs: nullableNumber
							})}
						/>
						<Field
							id='potSize'
							label='Размер горшка'
							placeholder='Например, 12-15 см'
							type='text'
							extra='mb-4'
							{...register('potSize', {
								setValueAs: nullableString
							})}
						/>
						<Field
							id='potType'
							label='Тип горшка'
							placeholder='Например, с дренажными отверстиями'
							type='text'
							extra='mb-4'
							{...register('potType', {
								setValueAs: nullableString
							})}
						/>
						<Field
							id='soilType'
							label='Грунт'
							placeholder='Например, рыхлый грунт с перлитом'
							type='text'
							extra='mb-4 sm:col-span-2'
							{...register('soilType', {
								setValueAs: nullableString
							})}
						/>
						<Field
							id='temperatureMin'
							label='Минимальная температура, °C'
							placeholder='Например, 18'
							type='number'
							extra='mb-4'
							isNumber
							{...register('temperatureMin', {
								setValueAs: nullableNumber
							})}
						/>
						<Field
							id='temperatureMax'
							label='Максимальная температура, °C'
							placeholder='Например, 27'
							type='number'
							extra='mb-4'
							isNumber
							{...register('temperatureMax', {
								setValueAs: nullableNumber
							})}
						/>
						<Field
							id='humidityMin'
							label='Минимальная влажность, %'
							placeholder='Например, 45'
							type='number'
							extra='mb-4'
							isNumber
							{...register('humidityMin', {
								setValueAs: nullableNumber
							})}
						/>
						<Field
							id='humidityMax'
							label='Максимальная влажность, %'
							placeholder='Например, 70'
							type='number'
							extra='mb-4'
							isNumber
							{...register('humidityMax', {
								setValueAs: nullableNumber
							})}
						/>
						<Field
							id='wateringIntervalDays'
							label='Базовый интервал полива'
							placeholder='Например, 7 дней'
							type='number'
							min={1}
							extra='mb-4'
							isNumber
							{...register('wateringIntervalDays', {
								setValueAs: nullableNumber
							})}
						/>
						<Field
							id='wateringIntervalSpringDays'
							label='Весенний интервал полива'
							placeholder='Например, 7 дней'
							type='number'
							min={1}
							extra='mb-4'
							isNumber
							{...register('wateringIntervalSpringDays', {
								setValueAs: nullableNumber
							})}
						/>
						<Field
							id='wateringIntervalSummerDays'
							label='Летний интервал полива'
							placeholder='Например, 5 дней'
							type='number'
							min={1}
							extra='mb-4'
							isNumber
							{...register('wateringIntervalSummerDays', {
								setValueAs: nullableNumber
							})}
						/>
						<Field
							id='wateringIntervalAutumnDays'
							label='Осенний интервал полива'
							placeholder='Например, 10 дней'
							type='number'
							min={1}
							extra='mb-4'
							isNumber
							{...register('wateringIntervalAutumnDays', {
								setValueAs: nullableNumber
							})}
						/>
						<Field
							id='wateringIntervalWinterDays'
							label='Зимний интервал полива'
							placeholder='Например, 14 дней'
							type='number'
							min={1}
							extra='mb-4'
							isNumber
							{...register('wateringIntervalWinterDays', {
								setValueAs: nullableNumber
							})}
						/>
						<Field
							id='fertilizingIntervalDays'
							label='Интервал подкормки'
							placeholder='Например, 21 день'
							type='number'
							min={1}
							extra='mb-4'
							isNumber
							{...register('fertilizingIntervalDays', {
								setValueAs: nullableNumber
							})}
						/>
						<Field
							id='wateringNotes'
							label='Заметка по поливу'
							placeholder='Например, поливать после просушки верхнего слоя'
							type='text'
							extra='mb-6 sm:col-span-2'
							{...register('wateringNotes', {
								setValueAs: nullableString
							})}
						/>
					</div>

					<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
						<Button
							type='button'
							className='rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-white hover:bg-white/10'
							onClick={closeModal}
						>
							Отмена
						</Button>
						<Button
							type='submit'
							disabled={isPending}
							className='rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed disabled:opacity-70'
						>
							{isPending ? 'Сохраняем...' : 'Добавить растение'}
						</Button>
					</div>
				</form>
			</Modal>
		</>
	)
}
