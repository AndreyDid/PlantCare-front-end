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
	danger: 'border-red-300/25 bg-red-400/12 text-red-100',
	warning: 'border-amber-300/25 bg-amber-300/12 text-amber-100',
	good: 'border-emerald-300/25 bg-emerald-300/12 text-emerald-100',
	muted: 'border-white/10 bg-white/5 text-white/60'
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
		<div className='rounded-xl border border-white/8 bg-white/[0.04] p-3'>
			<div className='mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40'>
				{icon}
				{label}
			</div>
			<p className='text-sm leading-5 text-white/80'>{value}</p>
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
			className='cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(255,255,255,0.04))] shadow-[0_16px_46px_rgba(0,0,0,0.22)] transition hover:border-emerald-200/30'
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
			<div className='relative h-64 w-full overflow-hidden sm:h-72'>
				{plant.photoUrl ? (
					<Image
						src={plant.photoUrl}
						alt={plant.plantName}
						fill
						unoptimized
						sizes='(max-width: 1024px) 100vw, 720px'
						className='object-cover'
					/>
				) : (
					<div className='flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(142,229,143,0.18),rgba(255,255,255,0.05))] text-emerald-100'>
						<Flower2 size={86} />
					</div>
				)}
				<div
					className={`absolute left-4 top-4 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-md ${statusToneClasses[wateringStatus.tone]}`}
				>
					{wateringStatus.label}
				</div>
			</div>
			<div className='p-5'>
				<div className='mb-5 flex items-start justify-between gap-4'>
					<div className='min-w-0'>
						<p className='mb-2 truncate text-[12px] uppercase tracking-[0.28em] text-emerald-100/55'>
							{plant.plantName}
						</p>
						<h3 className='text-lg font-semibold leading-6 text-white'>
							{plant.nickname || plant.plantName}
						</h3>
						{plant.location ? (
							<p className='mt-2 flex items-center gap-1.5 text-xs text-white/55'>
								<MapPin size={14} />
								{plant.location}
							</p>
						) : null}
					</div>
					<Button
						type='button'
						aria-label='Удалить растение'
						className='h-10 w-10 shrink-0 rounded-xl px-0 text-white/65 hover:border-red-200/30 hover:text-red-100'
						disabled={isPending}
						onClick={event => {
							event.stopPropagation()
							mutate()
						}}
					>
						<Trash />
					</Button>
				</div>
				<div className='grid gap-3'>
					<PlantFact
						icon={<Droplets size={14} />}
						label='Следующий полив'
						value={formatDate(plant.nextWateringAt)}
					/>
					<div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2'>
						<PlantFact
							icon={<CalendarDays size={14} />}
							label='Поливали'
							value={formatDate(plant.lastWateredAt)}
						/>
						<PlantFact
							icon={<Timer size={14} />}
							label={`Интервал · ${seasonLabels[activeSeason]}`}
							value={
								activeWateringInterval
									? `Каждые ${formatDays(activeWateringInterval)}`
									: 'Не задан'
							}
						/>
					</div>
					<PlantFact
						icon={<Sprout size={14} />}
						label='В коллекции'
						value={formatDate(plant.createdAt)}
					/>
				</div>
			</div>
		</div>
	)
}
