'use client'

import {
	CalendarDays,
	Clock3,
	Droplets,
	Eye,
	Filter,
	FlaskConical,
	History,
	RefreshCw,
	RotateCcw,
	Sprout,
	StickyNote
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Button } from '@/src/components/ui/buttons/Button'
import { DASHBOARD_PAGES } from '@/src/config/pages-url.config'
import { useAllPlantCareEvents, useUserPlants } from '@/src/hooks/userPlants'
import { formatDate, formatDateTime } from '@/src/shared/utils/date.utils'
import {
	careEventTypeOptions,
	getCareEventLabel
} from '@/src/shared/utils/plant-care.utils'
import type {
	PlantCareEventFilters,
	PlantCareEventType,
	PlantCareEventWithPlant
} from '@/src/types/plants.types'

function getDateInputValue(date: Date) {
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')

	return `${date.getFullYear()}-${month}-${day}`
}

function getPlantTitle(event: PlantCareEventWithPlant) {
	return event.plant.nickname || event.plant.plantName || 'Без названия'
}

function getCustomEventTitle(event: PlantCareEventWithPlant) {
	const title = event.title?.trim()
	const typeLabel = getCareEventLabel(event.type)

	return title && title !== typeLabel ? title : null
}

function getCareEventBadgeClass(type: PlantCareEventType) {
	if (type === 'WATERING') {
		return 'border-emerald-200/20 bg-emerald-300/10 text-emerald-100'
	}

	if (type === 'FERTILIZING') {
		return 'border-lime-200/20 bg-lime-300/10 text-lime-100'
	}

	if (type === 'REPOTTING') {
		return 'border-sky-200/20 bg-sky-300/10 text-sky-100'
	}

	if (type === 'OBSERVATION') {
		return 'border-violet-200/20 bg-violet-300/10 text-violet-100'
	}

	return 'border-white/12 bg-white/8 text-white/75'
}

function getCareEventIconClass(type: PlantCareEventType) {
	if (type === 'WATERING') {
		return 'border-emerald-200/25 bg-emerald-300/12 text-emerald-100 shadow-[0_0_28px_rgba(52,211,153,0.12)]'
	}

	if (type === 'FERTILIZING') {
		return 'border-lime-200/25 bg-lime-300/12 text-lime-100 shadow-[0_0_28px_rgba(190,242,100,0.1)]'
	}

	if (type === 'REPOTTING') {
		return 'border-sky-200/25 bg-sky-300/12 text-sky-100 shadow-[0_0_28px_rgba(125,211,252,0.1)]'
	}

	if (type === 'OBSERVATION') {
		return 'border-violet-200/25 bg-violet-300/12 text-violet-100 shadow-[0_0_28px_rgba(196,181,253,0.1)]'
	}

	return 'border-white/14 bg-white/8 text-white/75'
}

function CareEventIcon({
	size,
	type
}: {
	size: number
	type: PlantCareEventType
}) {
	if (type === 'WATERING') return <Droplets size={size} />
	if (type === 'FERTILIZING') return <FlaskConical size={size} />
	if (type === 'REPOTTING') return <RefreshCw size={size} />
	if (type === 'OBSERVATION') return <Eye size={size} />

	return <StickyNote size={size} />
}

function getActiveFiltersCount(filters: PlantCareEventFilters) {
	return Object.values(filters).filter(Boolean).length
}

function CareHistoryEventRow({ event }: { event: PlantCareEventWithPlant }) {
	const customTitle = getCustomEventTitle(event)
	const shouldShowHeadline = Boolean(customTitle || !event.description)

	return (
		<article className='group relative overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.028))] p-3 shadow-[0_18px_46px_rgba(0,0,0,0.18)] transition duration-200 hover:border-emerald-100/18 hover:bg-white/[0.055] sm:rounded-[22px] sm:p-4'>
			<div className='pointer-events-none absolute inset-y-4 left-[34px] hidden w-px bg-gradient-to-b from-transparent via-white/12 to-transparent lg:block' />
			<div className='relative grid min-w-0 gap-3 lg:grid-cols-[48px_minmax(0,1fr)_minmax(230px,0.34fr)] lg:items-start'>
				<div
					className={`flex h-10 w-10 items-center justify-center rounded-[14px] border sm:h-11 sm:w-11 sm:rounded-2xl ${getCareEventIconClass(event.type)}`}
				>
					<CareEventIcon
						type={event.type}
						size={19}
					/>
				</div>

				<div className='min-w-0'>
					<div className='flex flex-wrap items-center gap-2'>
						<span
							className={`inline-flex min-h-8 items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold ${getCareEventBadgeClass(event.type)}`}
						>
							<CareEventIcon
								type={event.type}
								size={14}
							/>
							{getCareEventLabel(event.type)}
						</span>
						{event.amountMl ? (
							<span className='inline-flex min-h-8 items-center rounded-xl border border-white/8 bg-black/12 px-3 py-1 text-xs font-medium text-white/62'>
								{event.amountMl} мл
							</span>
						) : null}
					</div>

					{shouldShowHeadline || event.description ? (
						<div className='mt-3'>
							{shouldShowHeadline ? (
								<h3 className='text-base font-semibold leading-snug text-white'>
									{customTitle || getCareEventLabel(event.type)}
								</h3>
							) : null}
							{event.description ? (
								<p
									className={`max-w-3xl text-sm leading-6 text-white/62 ${
										shouldShowHeadline ? 'mt-2' : ''
									}`}
								>
									{event.description}
								</p>
							) : null}
						</div>
					) : null}
				</div>

				<div className='grid min-w-0 gap-2 rounded-[16px] border border-white/8 bg-black/12 p-3 sm:rounded-[18px] lg:justify-self-end lg:bg-black/10'>
					<Link
						href={DASHBOARD_PAGES.PLANT(event.plant.id)}
						className='flex min-w-0 items-center gap-3 rounded-2xl transition hover:bg-white/[0.045] lg:min-w-[210px]'
					>
						<div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-white/10 bg-white/8 text-emerald-100'>
							{event.plant.photoUrl ? (
								<div
									aria-hidden='true'
									className='h-full w-full bg-cover bg-center'
									style={{
										backgroundImage: `url(${event.plant.photoUrl})`
									}}
								/>
							) : (
								<Sprout size={18} />
							)}
						</div>
						<div className='min-w-0'>
							<p className='truncate text-sm font-semibold text-white'>
								{getPlantTitle(event)}
							</p>
							{event.plant.location ? (
								<p className='truncate text-xs text-white/45'>
									{event.plant.location}
								</p>
							) : null}
						</div>
					</Link>
					<div className='flex min-w-0 items-center gap-2 text-xs text-white/45'>
						<Clock3
							size={14}
							className='shrink-0'
						/>
						<time className='min-w-0 truncate'>
							{formatDateTime(event.eventAt)}
						</time>
					</div>
				</div>
			</div>
		</article>
	)
}

export function CareHistoryPage() {
	const [plantId, setPlantId] = useState('')
	const [type, setType] = useState<PlantCareEventType | ''>('')
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')
	const filters = useMemo<PlantCareEventFilters>(
		() => ({
			plantId: plantId || undefined,
			type: type || undefined,
			dateFrom: dateFrom || undefined,
			dateTo: dateTo || undefined
		}),
		[dateFrom, dateTo, plantId, type]
	)
	const activeFiltersCount = getActiveFiltersCount(filters)
	const { data: plantsData, isLoading: arePlantsLoading } = useUserPlants()
	const { data: eventsData, isLoading: areEventsLoading } =
		useAllPlantCareEvents(filters)
	const plants = useMemo(() => plantsData ?? [], [plantsData])
	const events = useMemo(() => eventsData ?? [], [eventsData])
	const isLoading = arePlantsLoading || areEventsLoading

	const groupedEvents = useMemo(() => {
		return events.reduce<Record<string, PlantCareEventWithPlant[]>>(
			(groups, event) => {
				const dateKey = formatDate(event.eventAt)
				groups[dateKey] = groups[dateKey] ?? []
				groups[dateKey].push(event)

				return groups
			},
			{}
		)
	}, [events])

	function setTodayFilter() {
		const today = getDateInputValue(new Date())
		setDateFrom(today)
		setDateTo(today)
	}

	function setLastWeekFilter() {
		const today = new Date()
		const weekAgo = new Date(today)
		weekAgo.setDate(today.getDate() - 6)
		setDateFrom(getDateInputValue(weekAgo))
		setDateTo(getDateInputValue(today))
	}

	function resetFilters() {
		setPlantId('')
		setType('')
		setDateFrom('')
		setDateTo('')
	}

	return (
		<div className='w-full max-w-7xl'>
			<section className='rounded-[18px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:rounded-[28px] sm:p-6 lg:rounded-[32px] lg:p-8'>
				<div className='mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 sm:mb-6 sm:gap-4 sm:pb-5 lg:flex-row lg:items-end lg:justify-between'>
					<div>
						<p className='mb-2 text-[10px] uppercase tracking-[0.22em] text-emerald-100/60 sm:mb-3 sm:text-xs sm:tracking-[0.32em]'>
							Care History
						</p>
						<h1 className='text-xl font-semibold text-white sm:text-3xl'>
							История ухода
						</h1>
						<p className='mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:mt-3'>
							Общая лента поливов, подкормок, пересадок и заметок по всем растениям.
						</p>
					</div>
					<div className='grid grid-cols-2 gap-2 sm:flex sm:gap-3'>
						<div className='rounded-2xl border border-white/10 bg-black/10 px-3 py-2.5 sm:px-4 sm:py-3'>
							<p className='text-[10px] uppercase tracking-[0.14em] text-white/40 sm:tracking-[0.2em]'>
								Событий
							</p>
							<p className='mt-1 text-xl font-semibold text-white sm:text-2xl'>
								{events.length}
							</p>
						</div>
						<div className='rounded-2xl border border-white/10 bg-black/10 px-3 py-2.5 sm:px-4 sm:py-3'>
							<p className='text-[10px] uppercase tracking-[0.14em] text-white/40 sm:tracking-[0.2em]'>
								Фильтров
							</p>
							<p className='mt-1 text-xl font-semibold text-white sm:text-2xl'>
								{activeFiltersCount}
							</p>
						</div>
					</div>
				</div>

				<div className='mb-4 rounded-[18px] border border-white/10 bg-black/10 p-3 sm:mb-5 sm:rounded-[20px] sm:p-4'>
					<div className='mb-3 flex items-center gap-2 text-sm font-semibold text-white sm:mb-4'>
						<Filter size={16} />
						Фильтры
					</div>
					<div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
						<label className='grid min-w-0 gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/45 sm:text-xs sm:tracking-[0.16em]'>
							Растение
							<select
								value={plantId}
								onChange={event => setPlantId(event.target.value)}
								className='h-11 min-w-0 rounded-2xl border border-white/10 bg-[#07110d] px-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-emerald-200/50'
							>
								<option value=''>Все растения</option>
								{plants.map(plant => (
									<option
										key={plant.id}
										value={plant.id}
									>
										{plant.nickname || plant.plantName || 'Без названия'}
									</option>
								))}
							</select>
						</label>
						<label className='grid min-w-0 gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/45 sm:text-xs sm:tracking-[0.16em]'>
							Тип события
							<select
								value={type}
								onChange={event =>
									setType(event.target.value as PlantCareEventType | '')
								}
								className='h-11 min-w-0 rounded-2xl border border-white/10 bg-[#07110d] px-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-emerald-200/50'
							>
								<option value=''>Все типы</option>
								{careEventTypeOptions.map(option => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>
						</label>
						<label className='grid min-w-0 gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/45 sm:text-xs sm:tracking-[0.16em]'>
							С даты
							<input
								type='date'
								value={dateFrom}
								onChange={event => setDateFrom(event.target.value)}
								className='h-11 min-w-0 rounded-2xl border border-white/10 bg-[#07110d] px-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-emerald-200/50'
							/>
						</label>
						<label className='grid min-w-0 gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/45 sm:text-xs sm:tracking-[0.16em]'>
							По дату
							<input
								type='date'
								value={dateTo}
								onChange={event => setDateTo(event.target.value)}
								className='h-11 min-w-0 rounded-2xl border border-white/10 bg-[#07110d] px-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-emerald-200/50'
							/>
						</label>
					</div>
					<div className='mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap'>
						<Button
							type='button'
							className='h-10 w-full rounded-2xl px-3 text-xs text-emerald-50 hover:bg-white/8 sm:w-auto'
							onClick={setTodayFilter}
						>
							<CalendarDays size={15} />
							Сегодня
						</Button>
						<Button
							type='button'
							className='h-10 w-full rounded-2xl px-3 text-xs text-emerald-50 hover:bg-white/8 sm:w-auto'
							onClick={setLastWeekFilter}
						>
							<CalendarDays size={15} />
							7 дней
						</Button>
						<Button
							type='button'
							className='col-span-2 h-10 w-full rounded-2xl px-3 text-xs text-white/70 hover:bg-white/8 sm:col-span-1 sm:w-auto'
							onClick={resetFilters}
						>
							<RotateCcw size={15} />
							Сбросить
						</Button>
					</div>
				</div>

				{isLoading ? (
					<div className='grid gap-3'>
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className='h-24 rounded-[20px] border border-white/8 bg-white/[0.04]'
							/>
						))}
					</div>
				) : events.length ? (
					<div className='grid gap-4 sm:gap-5'>
						{Object.entries(groupedEvents).map(([dateLabel, dayEvents]) => (
							<div
								key={dateLabel}
								className='grid gap-3'
							>
								<div className='flex items-center gap-2 text-xs font-semibold text-emerald-100 sm:gap-3 sm:text-sm'>
									<div className='h-px flex-1 bg-white/10' />
									<span className='shrink-0'>{dateLabel}</span>
									<div className='h-px flex-1 bg-white/10' />
								</div>
								<div className='grid gap-3'>
									{dayEvents.map(event => (
										<CareHistoryEventRow
											key={event.id}
											event={event}
										/>
									))}
									{/*
										<article>
											<Link
												href={DASHBOARD_PAGES.PLANT(event.plant.id)}
												className='flex min-w-0 items-center gap-2.5 rounded-2xl transition hover:bg-white/[0.04] md:-m-2 md:p-2'
											>
												<div className='flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-white/10 bg-white/8 text-emerald-100 sm:h-9 sm:w-9 sm:rounded-[14px]'>
													{event.plant.photoUrl ? (
														<div
															aria-hidden='true'
															className='h-full w-full bg-cover bg-center'
															style={{
																backgroundImage: `url(${event.plant.photoUrl})`
															}}
														/>
													) : (
														<Sprout size={18} />
													)}
												</div>
												<div className='min-w-0'>
													<p className='truncate text-sm font-semibold text-white sm:text-[15px]'>
														{getPlantTitle(event)}
													</p>
													{event.plant.location ? (
														<p className='truncate text-xs text-white/45'>
															{event.plant.location}
														</p>
													) : null}
												</div>
											</Link>
											<div className='min-w-0 rounded-2xl bg-white/[0.035] p-3 md:bg-transparent md:p-0'>
												<div className='flex flex-wrap items-center gap-2'>
													<span
														className={`inline-flex min-h-8 items-center rounded-xl border px-3 py-1 text-xs font-semibold ${getCareEventBadgeClass(event.type)}`}
													>
														{getCareEventLabel(event.type)}
													</span>
													{event.amountMl ? (
														<span className='inline-flex min-h-8 items-center rounded-xl border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/65'>
															{event.amountMl} мл
														</span>
													) : null}
												</div>
												{getCustomEventTitle(event) ? (
													<p className='mt-2 text-sm font-semibold text-white'>
														{getCustomEventTitle(event)}
													</p>
												) : null}
												{event.description ? (
													<p className='mt-2 text-sm leading-6 text-white/60'>
														{event.description}
													</p>
												) : null}
											</div>
											<div className='flex items-center gap-2 border-t border-white/8 pt-2 text-xs text-white/45 md:justify-end md:border-t-0 md:pt-0'>
												<History
													size={15}
													className='shrink-0'
												/>
												<time className='min-w-0 break-words'>
													{formatDateTime(event.eventAt)}
												</time>
											</div>
										</article>
									*/}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='rounded-[24px] border border-dashed border-white/14 bg-black/10 p-8 text-center'>
						<div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-200'>
							<History size={22} />
						</div>
						<h2 className='text-xl font-semibold text-white'>
							Событий не найдено
						</h2>
						<p className='mx-auto mt-3 max-w-md text-sm leading-6 text-white/60'>
							Попробуйте изменить фильтры или добавьте событие в карточке растения.
						</p>
					</div>
				)}
			</section>
		</div>
	)
}
