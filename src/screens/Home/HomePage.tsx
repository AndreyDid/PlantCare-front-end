'use client'

import {
	Bell,
	CalendarDays,
	Check,
	Clock3,
	Droplets,
	Sprout
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/src/components/ui/buttons/Button'
import { Modal } from '@/src/components/ui/modal/Modal'
import {
	useWaterDueTodayUserPlants,
	useWaterSelectedUserPlants,
	useWateringOverview
} from '@/src/hooks/userPlants'
import { GetPlant } from '@/src/types/plants.types'

const DAY_MS = 1000 * 60 * 60 * 24

function formatCount(count: number, labels: [string, string, string]) {
	const lastTwoDigits = count % 100
	const lastDigit = count % 10

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return labels[2]
	if (lastDigit === 1) return labels[0]
	if (lastDigit >= 2 && lastDigit <= 4) return labels[1]

	return labels[2]
}

function getDate(date?: string | null) {
	if (!date) return null

	const parsedDate = new Date(date)

	return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

function getDaysUntil(date?: string | null) {
	const parsedDate = getDate(date)

	if (!parsedDate) return null

	const today = new Date()
	const startOfToday = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate()
	)
	const startOfDate = new Date(
		parsedDate.getFullYear(),
		parsedDate.getMonth(),
		parsedDate.getDate()
	)

	return Math.round((startOfDate.getTime() - startOfToday.getTime()) / DAY_MS)
}

function formatWateringDate(date?: string | null) {
	const parsedDate = getDate(date)

	if (!parsedDate) return 'Дата не указана'

	const daysUntil = getDaysUntil(date)
	const formattedDate = new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'short'
	}).format(parsedDate)

	if (daysUntil === null) return formattedDate
	if (daysUntil < 0) return `Просрочено: ${formattedDate}`
	if (daysUntil === 0) return `Сегодня, ${formattedDate}`
	if (daysUntil === 1) return `Завтра, ${formattedDate}`

	return formattedDate
}

function getPlantTitle(plant: GetPlant) {
	return plant.nickname || plant.plantName || 'Без названия'
}

function getPlantLocation(plant: GetPlant) {
	return plant.location?.trim() || 'Без локации'
}

function groupPlantsByLocation(plants: GetPlant[]) {
	return plants.reduce<{ location: string; plants: GetPlant[] }[]>(
		(groups, plant) => {
			const location = getPlantLocation(plant)
			const currentGroup = groups.find(group => group.location === location)

			if (currentGroup) {
				currentGroup.plants.push(plant)
				return groups
			}

			return [...groups, { location, plants: [plant] }]
		},
		[]
	)
}

function WateringSkeleton() {
	return (
		<div className='grid gap-6 lg:grid-cols-2'>
			{Array.from({ length: 2 }).map((_, index) => (
				<div
					key={index}
					className='rounded-3xl border border-white/10 bg-black/15 p-5'
				>
					<div className='mb-5 flex items-center gap-3'>
						<div className='h-10 w-10 rounded-2xl bg-white/10' />
						<div className='space-y-3'>
							<div className='h-4 w-36 rounded-full bg-white/10' />
							<div className='h-3 w-24 rounded-full bg-white/10' />
						</div>
					</div>
					<div className='space-y-3'>
						<div className='h-16 rounded-2xl bg-white/8' />
						<div className='h-16 rounded-2xl bg-white/8' />
					</div>
				</div>
			))}
		</div>
	)
}

function WateringList({
	emptyText,
	plants
}: {
	emptyText: string
	plants: GetPlant[]
}) {
	const groupedPlants = groupPlantsByLocation(plants)

	if (!plants.length) {
		return (
			<div className='rounded-2xl border border-dashed border-white/12 bg-white/[0.03] px-4 py-8 text-center text-sm leading-6 text-white/55'>
				{emptyText}
			</div>
		)
	}

	return (
		<div className='max-h-[420px] space-y-4 overflow-y-auto pr-1'>
			{groupedPlants.map(group => (
				<div
					key={group.location}
					className='space-y-2'
				>
					<div className='sticky top-0 z-10 flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#0b1913]/95 px-3 py-2 text-xs backdrop-blur-md'>
						<span className='truncate font-medium text-emerald-100'>
							{group.location}
						</span>
						<span className='shrink-0 text-white/40'>
							{group.plants.length}{' '}
							{formatCount(group.plants.length, [
								'растение',
								'растения',
								'растений'
							])}
						</span>
					</div>

					<div className='flex flex-col gap-2'>
						{group.plants.map(plant => {
							const daysUntil = getDaysUntil(plant.nextWateringAt)
							const isOverdue = daysUntil !== null && daysUntil < 0

							return (
								<div
									key={plant.id}
									className='flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/5 px-3 py-2.5'
								>
									<div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-emerald-300/10 text-emerald-100'>
										{plant.photoUrl ? (
											<Image
												src={plant.photoUrl}
												alt={getPlantTitle(plant)}
												fill
												unoptimized
												sizes='48px'
												className='object-cover'
											/>
										) : (
											<div className='flex h-full w-full items-center justify-center'>
												<Sprout size={20} />
											</div>
										)}
									</div>

									<div className='min-w-0 flex-1'>
										<p className='truncate font-medium text-white'>
											{getPlantTitle(plant)}
										</p>
										<p className='mt-1 truncate text-xs text-white/55'>
											{plant.plantName || 'Комнатное растение'}
										</p>
									</div>
									<div
										className={`flex shrink-0 items-center gap-2 text-right text-xs sm:text-sm ${
											isOverdue ? 'text-red-100/80' : 'text-emerald-100/75'
										}`}
									>
										<Clock3 size={15} />
										<span>{formatWateringDate(plant.nextWateringAt)}</span>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			))}
		</div>
	)
}

export function HomePage() {
	const [isSelectModalOpen, setIsSelectModalOpen] = useState(false)
	const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([])
	const { data, isLoading } = useWateringOverview()
	const { mutate: waterDueToday, isPending: isWaterDueTodayPending } =
		useWaterDueTodayUserPlants()
	const { mutate: waterSelected, isPending: isWaterSelectedPending } =
		useWaterSelectedUserPlants()

	const dueToday = data?.dueToday ?? []
	const dueTomorrow = data?.dueTomorrow ?? []
	const allUpcomingPlants = [...dueToday, ...dueTomorrow]
	const upcomingCount = allUpcomingPlants.length

	const openSelectModal = () => {
		setSelectedPlantIds(dueToday.map(plant => plant.id))
		setIsSelectModalOpen(true)
	}

	const closeSelectModal = () => {
		setIsSelectModalOpen(false)
		setSelectedPlantIds([])
	}

	const togglePlant = (plantId: string) => {
		setSelectedPlantIds(current =>
			current.includes(plantId)
				? current.filter(id => id !== plantId)
				: [...current, plantId]
		)
	}

	return (
		<div className='relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6'>
			<section className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8'>
				<div className='flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between'>
					<div>
						<p className='mb-3 text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
							Home
						</p>
						<h1 className='text-2xl font-semibold text-white sm:text-3xl'>
							Главная
						</h1>
						<p className='mt-3 max-w-2xl text-sm leading-6 text-white/60'>
							Короткая сводка по уходу: что нужно полить сегодня, что подойдет к
							сроку завтра, и быстрый выбор растений для полива.
						</p>
					</div>

					<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
						<div className='flex items-center gap-3 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-4 py-3 text-emerald-100'>
							<Sprout size={20} />
							<span className='text-sm font-medium'>
								{upcomingCount}{' '}
								{formatCount(upcomingCount, [
									'ближайший полив',
									'ближайших полива',
									'ближайших поливов'
								])}
							</span>
						</div>
						<Button
							type='button'
							disabled={!upcomingCount || isLoading}
							className='rounded-2xl border-emerald-200/20 bg-white/8 px-4 py-3 text-emerald-50 hover:bg-white/12 disabled:cursor-not-allowed'
							onClick={openSelectModal}
						>
							<Droplets size={17} />
							Полить выборочно
						</Button>
					</div>
				</div>

				<div className='mt-6'>
					{isLoading ? (
						<WateringSkeleton />
					) : (
						<div className='grid gap-6 lg:grid-cols-2'>
							<div className='rounded-3xl border border-white/10 bg-black/15 p-5'>
								<div className='mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
									<div className='flex items-center gap-3'>
										<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-300/12 text-emerald-100'>
											<Droplets size={20} />
										</div>
										<div>
											<h2 className='text-base font-semibold text-white'>
												Полить сегодня
											</h2>
											<p className='text-sm text-white/50'>
												Сегодняшние и просроченные
											</p>
										</div>
									</div>
									<Button
										type='button'
										disabled={!dueToday.length || isWaterDueTodayPending}
										className='rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-4 py-2.5 font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.22)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed'
										onClick={() => {
											waterDueToday(undefined, {
												onSuccess: plants => {
													toast.success(
														plants.length
															? 'Актуальные растения политы'
															: 'На сегодня поливов нет'
													)
												}
											})
										}}
									>
										<Check size={17} />
										{isWaterDueTodayPending ? 'Поливаем...' : 'Полить все'}
									</Button>
								</div>

								<WateringList
									plants={dueToday}
									emptyText='На сегодня и просроченных поливов нет.'
								/>
							</div>

							<div className='rounded-3xl border border-white/10 bg-black/15 p-5'>
								<div className='mb-5 flex items-center justify-between gap-3'>
									<div className='flex items-center gap-3'>
										<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300/12 text-lime-100'>
											<CalendarDays size={20} />
										</div>
										<div>
											<h2 className='text-base font-semibold text-white'>
												Ближайший полив
											</h2>
											<p className='text-sm text-white/50'>
												Нужно полить завтра
											</p>
										</div>
									</div>
									<Bell
										className='text-emerald-100/50'
										size={19}
									/>
								</div>

								<WateringList
									plants={dueTomorrow}
									emptyText='На завтра поливов нет.'
								/>
							</div>
						</div>
					)}
				</div>
			</section>

			<Modal
				isOpen={isSelectModalOpen}
				onClose={closeSelectModal}
				title='Выбрать растения'
				titleId='select-plants-to-water-title'
				eyebrow='Watering'
				description='Отметьте растения из сегодняшнего и завтрашнего списка, которые уже полили.'
				closeLabel='Закрыть выбор растений'
			>
				<div className='flex flex-col gap-3'>
					{allUpcomingPlants.map(plant => {
						const isSelected = selectedPlantIds.includes(plant.id)

						return (
							<label
								key={plant.id}
								className='flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]'
							>
								<input
									type='checkbox'
									checked={isSelected}
									onChange={() => togglePlant(plant.id)}
									className='h-5 w-5 shrink-0 accent-emerald-300'
								/>
								{/* <span className='min-w-0 flex-1'>
									<span className='block truncate font-medium text-white'>
										{getPlantTitle(plant)}
									</span>
									<span className='mt-1 block truncate text-sm text-white/55'>
										{formatWateringDate(plant.nextWateringAt)}
									</span>
								</span> */}
								<div
									key={plant.id}
									className='flex items-center justify-between gap-3 min-w-0 flex-1'
									// className='flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/5 px-3 py-2.5'
								>
									<div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-emerald-300/10 text-emerald-100'>
										{plant.photoUrl ? (
											<Image
												src={plant.photoUrl}
												alt={getPlantTitle(plant)}
												fill
												unoptimized
												sizes='48px'
												className='object-cover'
											/>
										) : (
											<div className='flex h-full w-full items-center justify-center'>
												<Sprout size={20} />
											</div>
										)}
									</div>

									<div className='min-w-0 flex-1'>
										<p className='truncate font-medium text-white'>
											{getPlantTitle(plant)}
										</p>
										<p className='mt-1 truncate text-xs text-white/55'>
											{plant.plantName || 'Комнатное растение'}
										</p>
									</div>
									<div
										className={`flex shrink-0 items-center gap-2 text-right text-xs sm:text-sm `}
									>
										<Clock3 size={15} />
										<span>{formatWateringDate(plant.nextWateringAt)}</span>
									</div>
								</div>
							</label>
						)
					})}
				</div>

				<div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
					<Button
						type='button'
						className='rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-white hover:bg-white/10'
						onClick={closeSelectModal}
					>
						Отмена
					</Button>
					<Button
						type='button'
						disabled={!selectedPlantIds.length || isWaterSelectedPending}
						className='rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed'
						onClick={() => {
							waterSelected(selectedPlantIds, {
								onSuccess: plants => {
									toast.success(
										`${plants.length} ${formatCount(plants.length, [
											'растение полито',
											'растения политы',
											'растений полито'
										])}`
									)
									closeSelectModal()
								}
							})
						}}
					>
						<Droplets size={17} />
						{isWaterSelectedPending ? 'Поливаем...' : 'Полить выбранные'}
					</Button>
				</div>
			</Modal>
		</div>
	)
}
