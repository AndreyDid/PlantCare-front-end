import {
	CalendarDays,
	Droplets,
	Flower2,
	Leaf,
	MapPin,
	Timer
} from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { formatDate } from '@/src/shared/utils/date.utils'
import {
	formatIntervalDays,
	formatWateringInterval,
	getPlantPotLabel,
	getWateringSeasonItems
} from '@/src/shared/utils/plant-care.utils'
import type { GetUserPlantById } from '@/src/types/plants.types'

interface PlantOverviewProps {
	plant: GetUserPlantById
	title: string
	subtitle: string
	photoPreviewUrl: string | null
	isWateringPending: boolean
	onWaterNow: () => void
}

function PlantFactRow({ label, value }: { label: string; value: string }) {
	return (
		<div className='flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2 sm:rounded-2xl'>
			<span className='min-w-0'>{label}</span>
			<span className='min-w-0 text-right font-medium text-white/85'>{value}</span>
		</div>
	)
}

function CareStatCard({
	icon,
	label,
	value
}: {
	icon: ReactNode
	label: string
	value: string
}) {
	return (
		<div className='rounded-2xl border border-white/10 bg-white/5 p-3 sm:rounded-[24px] sm:p-4'>
			{icon}
			<p className='mt-3 text-[10px] uppercase tracking-[0.18em] text-white/45 sm:mt-4 sm:text-[11px] sm:tracking-[0.24em]'>
				{label}
			</p>
			<p className='mt-1.5 text-xs font-semibold leading-5 text-white sm:mt-2 sm:text-sm sm:leading-6'>
				{value}
			</p>
		</div>
	)
}

export function PlantOverview({
	plant,
	title,
	subtitle,
	photoPreviewUrl,
	isWateringPending,
	onWaterNow
}: PlantOverviewProps) {
	return (
		<div className='grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.75fr)] lg:gap-6'>
			<div className='relative min-h-[220px] overflow-hidden rounded-[20px] border border-white/10 bg-black/15 shadow-[0_16px_46px_rgba(0,0,0,0.22)] sm:min-h-[340px] sm:rounded-[26px] lg:min-h-[460px] lg:rounded-[28px]'>
				{photoPreviewUrl ? (
					<div
						aria-hidden='true'
						className='h-full min-h-[220px] bg-cover bg-center sm:min-h-[340px] lg:min-h-[460px]'
						style={{ backgroundImage: `url(${photoPreviewUrl})` }}
					/>
				) : plant.photoUrl ? (
					<Image
						src={plant.photoUrl}
						alt={title}
						fill
						unoptimized
						sizes='(max-width: 1024px) 100vw, 720px'
						className='object-cover'
					/>
				) : (
					<div className='flex h-full min-h-[220px] items-center justify-center bg-[linear-gradient(135deg,rgba(142,229,143,0.18),rgba(255,255,255,0.05))] text-emerald-100 sm:min-h-[340px] lg:min-h-[460px]'>
						<Flower2
							size={74}
							className='sm:size-[86px]'
						/>
					</div>
				)}
				<div className='absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#07110d]/70 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-100/70 backdrop-blur-xl sm:left-4 sm:top-4 sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]'>
					<Leaf size={16} />
					Мое растение
				</div>
			</div>

			<div className='flex flex-col'>
				<div className='rounded-[20px] border border-white/10 bg-black/15 p-3.5 sm:rounded-[28px] sm:p-5'>
					<p className='mb-2 text-[10px] uppercase tracking-[0.2em] text-emerald-100/55 sm:mb-3 sm:text-[11px] sm:tracking-[0.28em]'>
						Вид
					</p>
					<p className='text-base font-semibold text-white sm:text-xl'>
						{subtitle}
					</p>
					{plant.location ? (
						<p className='mt-2 inline-flex items-center gap-2 text-xs font-medium text-emerald-100/75 sm:mt-3 sm:text-sm'>
							<MapPin size={16} />
							{plant.location}
						</p>
					) : null}
					<div className='mt-3 grid gap-2 text-xs text-white/65 sm:mt-4 sm:text-sm'>
						<PlantFactRow
							label='Свет'
							value={plant.lightLevel || 'Не указан'}
						/>
						<PlantFactRow
							label='Горшок'
							value={getPlantPotLabel(plant)}
						/>
						<PlantFactRow
							label='Почва'
							value={plant.soilType || 'Не указана'}
						/>
					</div>
				</div>

				<div className='mt-3 rounded-[20px] border border-emerald-200/15 bg-emerald-300/10 p-3.5 sm:mt-4 sm:rounded-[28px] sm:p-5'>
					<div className='flex items-center gap-3 sm:gap-4'>
						<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-300 text-slate-950 sm:h-12 sm:w-12'>
							<Droplets size={20} />
						</div>
						<div>
							<p className='text-[10px] uppercase tracking-[0.18em] text-emerald-100/60 sm:text-[11px] sm:tracking-[0.28em]'>
								Следующий полив
							</p>
							<p className='mt-1 text-base font-semibold text-white sm:text-lg'>
								{formatDate(plant.nextWateringAt)}
							</p>
						</div>
					</div>
				</div>

				<div className='mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3'>
					<CareStatCard
						icon={
							<Droplets
								size={22}
								className='text-emerald-200'
							/>
						}
						label='Последний полив'
						value={formatDate(plant.lastWateredAt)}
					/>
					<CareStatCard
						icon={
							<Timer
								size={22}
								className='text-emerald-200'
							/>
						}
						label='Интервал'
						value={formatWateringInterval(plant)}
					/>
					<CareStatCard
						icon={
							<CalendarDays
								size={22}
								className='text-emerald-200'
							/>
						}
						label='Добавлено'
						value={formatDate(plant.createdAt)}
					/>
				</div>

				<div className='mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:mt-4 sm:rounded-[24px] sm:p-4'>
					<p className='text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.24em]'>
						Полив по сезонам
					</p>
					<div className='mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3'>
						{getWateringSeasonItems(plant).map(item => (
							<div
								key={item.label}
								className='rounded-xl border border-white/8 bg-black/10 p-2.5 sm:rounded-2xl sm:p-3'
							>
								<p className='text-[11px] text-white/50 sm:text-xs'>{item.label}</p>
								<p className='mt-1 text-xs font-semibold text-white sm:text-sm'>
									{formatIntervalDays(item.value)}
								</p>
							</div>
						))}
					</div>
				</div>

				<button
					type='button'
					onClick={onWaterNow}
					disabled={isWateringPending}
					className='mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[18px] border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] transition hover:-translate-y-0.5 hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-6 sm:gap-3 sm:rounded-[20px] sm:px-5 sm:py-3.5 sm:text-base'
				>
					<Droplets size={20} />
					Полить сейчас
				</button>
			</div>
		</div>
	)
}
