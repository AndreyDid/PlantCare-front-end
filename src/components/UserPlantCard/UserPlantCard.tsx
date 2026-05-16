import {
	CalendarDays,
	Droplets,
	Flower2,
	MapPin,
	Sprout,
	Timer,
	Trash
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '../ui/buttons/Button'

import { DASHBOARD_PAGES } from '@/src/config/pages-url.config'
import { useDeleteUserPlant } from '@/src/hooks/userPlants'
import { GetPlant } from '@/src/types/plants.types'

const DAY_MS = 1000 * 60 * 60 * 24

const seasonLabels = {
	spring: 'Весна',
	summer: 'Лето',
	autumn: 'Осень',
	winter: 'Зима'
} as const

const statusToneClasses = {
	danger: 'border-red-300/25 bg-red-400/15 text-red-50',
	warning: 'border-amber-300/25 bg-amber-300/15 text-amber-50',
	good: 'border-emerald-300/25 bg-emerald-300/15 text-emerald-50',
	muted: 'border-white/10 bg-white/8 text-white/65'
} as const

function getDate(date?: string | null) {
	if (!date) return null

	const parsedDate = new Date(date)

	return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

function formatDate(date?: string | null) {
	const parsedDate = getDate(date)

	if (!parsedDate) return 'Не указано'

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	}).format(parsedDate)
}

function formatDays(days: number) {
	const value = Math.abs(days)
	const lastTwoDigits = value % 100
	const lastDigit = value % 10

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${value} дней`
	if (lastDigit === 1) return `${value} день`
	if (lastDigit >= 2 && lastDigit <= 4) return `${value} дня`

	return `${value} дней`
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

function getWateringStatus(nextWateringAt?: string | null) {
	const daysUntil = getDaysUntil(nextWateringAt)

	if (daysUntil === null) {
		return {
			label: 'График не задан',
			tone: 'muted' as const
		}
	}

	if (daysUntil < 0) {
		return {
			label: `Просрочен на ${formatDays(daysUntil)}`,
			tone: 'danger' as const
		}
	}

	if (daysUntil === 0) {
		return {
			label: 'Полив сегодня',
			tone: 'warning' as const
		}
	}

	if (daysUntil === 1) {
		return {
			label: 'Полив завтра',
			tone: 'warning' as const
		}
	}

	return {
		label: `Полив через ${formatDays(daysUntil)}`,
		tone: 'good' as const
	}
}

function getSeasonByDate(date: Date) {
	const month = date.getMonth()

	if (month >= 2 && month <= 4) return 'spring'
	if (month >= 5 && month <= 7) return 'summer'
	if (month >= 8 && month <= 10) return 'autumn'

	return 'winter'
}

function getPositiveInterval(value?: number | null) {
	return value && value > 0 ? value : null
}

function getActiveWateringInterval(plant: GetPlant) {
	const season = getSeasonByDate(new Date())
	const baseInterval = getPositiveInterval(plant.wateringIntervalDays)

	if (season === 'spring') {
		return getPositiveInterval(plant.wateringIntervalSpringDays) ?? baseInterval
	}

	if (season === 'summer') {
		return getPositiveInterval(plant.wateringIntervalSummerDays) ?? baseInterval
	}

	if (season === 'autumn') {
		return getPositiveInterval(plant.wateringIntervalAutumnDays) ?? baseInterval
	}

	return getPositiveInterval(plant.wateringIntervalWinterDays) ?? baseInterval
}

function PlantFact({
	icon,
	label,
	value
}: {
	icon: React.ReactNode
	label: string
	value: string
}) {
	return (
		<div className='flex min-w-0 items-center gap-2.5'>
			<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/[0.05] text-emerald-100/80'>
				{icon}
			</span>
			<div className='min-w-0'>
				<p className='truncate text-[11px] uppercase tracking-[0.14em] text-white/38'>
					{label}
				</p>
				<p className='truncate text-sm font-medium leading-5 text-white/82'>
					{value}
				</p>
			</div>
		</div>
	)
}

export function UserPlantCard({ plant }: { plant: GetPlant }) {
	const router = useRouter()

	const { mutate, isPending } = useDeleteUserPlant(plant.id)
	const wateringStatus = getWateringStatus(plant.nextWateringAt)
	const activeSeason = getSeasonByDate(new Date())
	const activeWateringInterval = getActiveWateringInterval(plant)

	return (
		<div
			className='group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-[0_14px_38px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200/30 hover:bg-white/[0.065]'
			onClick={() => router.push(DASHBOARD_PAGES.PLANT(plant.id))}
			role='link'
			tabIndex={0}
			onKeyDown={event => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault()
					router.push(DASHBOARD_PAGES.PLANT(plant.id))
				}
			}}
		>
			<div className='relative h-36 w-full overflow-hidden bg-emerald-300/10 sm:h-40'>
				{plant.photoUrl ? (
					<Image
						src={plant.photoUrl}
						alt={plant.plantName}
						fill
						unoptimized
						sizes='(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw'
						className='object-cover transition duration-300 group-hover:scale-[1.03]'
					/>
				) : (
					<div className='flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(142,229,143,0.2),rgba(255,255,255,0.06))] text-emerald-100'>
						<Flower2 size={54} />
					</div>
				)}
				<div className='absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07110d]/90 to-transparent' />
				<div
					className={`absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full border px-2.5 py-1 text-xs font-medium shadow-[0_8px_22px_rgba(0,0,0,0.2)] backdrop-blur-md ${statusToneClasses[wateringStatus.tone]}`}
				>
					{wateringStatus.label}
				</div>
			</div>
			<div className='p-4'>
				<div className='mb-4 flex items-start justify-between gap-3'>
					<div className='min-w-0'>
						<p className='mb-1 truncate text-[11px] uppercase tracking-[0.18em] text-emerald-100/55'>
							{plant.plantName}
						</p>
						<h3 className='truncate text-base font-semibold leading-6 text-white'>
							{plant.nickname || plant.plantName}
						</h3>
						{plant.location ? (
							<p className='mt-1.5 flex min-w-0 items-center gap-1.5 text-xs text-white/55'>
								<MapPin
									size={13}
									className='shrink-0'
								/>
								<span className='truncate'>{plant.location}</span>
							</p>
						) : null}
					</div>
					<Button
						type='button'
						aria-label='Удалить растение'
						className='h-8 w-8 shrink-0 rounded-lg border-white/8 bg-black/10 px-0 text-white/55 hover:border-red-200/30 hover:bg-red-400/10 hover:text-red-100'
						disabled={isPending}
						onClick={event => {
							event.stopPropagation()
							mutate()
						}}
					>
						<Trash size={15} />
					</Button>
				</div>

				<div className='mb-3 rounded-xl border border-emerald-200/12 bg-emerald-300/[0.06] px-3 py-2.5'>
					<PlantFact
						icon={<Droplets size={15} />}
						label='Полив'
						value={formatDate(plant.nextWateringAt)}
					/>
				</div>

				<div className='grid gap-2.5 border-t border-white/8 pt-3'>
					<PlantFact
						icon={<Timer size={14} />}
						label={seasonLabels[activeSeason]}
						value={
							activeWateringInterval
								? `Каждые ${formatDays(activeWateringInterval)}`
								: 'Интервал не задан'
						}
					/>
					<PlantFact
						icon={<CalendarDays size={14} />}
						label='Поливали'
						value={formatDate(plant.lastWateredAt)}
					/>
					<PlantFact
						icon={<Sprout size={14} />}
						label='Добавлено'
						value={formatDate(plant.createdAt)}
					/>
				</div>
			</div>
		</div>
	)
}
