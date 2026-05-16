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
		<div className='flex items-center justify-between gap-4 rounded-2xl bg-white/[0.04] px-3 py-2'>
			<span>{label}</span>
			<span className='text-right font-medium text-white/85'>{value}</span>
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
		<div className='rounded-[24px] border border-white/10 bg-white/5 p-4'>
			{icon}
			<p className='mt-4 text-[11px] uppercase tracking-[0.24em] text-white/45'>
				{label}
			</p>
			<p className='mt-2 text-sm font-semibold leading-6 text-white'>
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
		<div className='grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)]'>
			<div className='relative min-h-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-black/15 shadow-[0_16px_46px_rgba(0,0,0,0.22)] sm:min-h-[460px]'>
				{photoPreviewUrl ? (
					<div
						aria-hidden='true'
						className='h-full min-h-[320px] bg-cover bg-center sm:min-h-[460px]'
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
					{plant.location ? (
						<p className='mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-100/75'>
							<MapPin size={16} />
							{plant.location}
						</p>
					) : null}
					<div className='mt-4 grid gap-2 text-sm text-white/65'>
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
								{formatDate(plant.nextWateringAt)}
							</p>
						</div>
					</div>
				</div>

				<div className='mt-4 grid gap-3 sm:grid-cols-2'>
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

				<div className='mt-4 rounded-[24px] border border-white/10 bg-white/5 p-4'>
					<p className='text-[11px] uppercase tracking-[0.24em] text-white/45'>
						Полив по сезонам
					</p>
					<div className='mt-4 grid grid-cols-2 gap-3'>
						{getWateringSeasonItems(plant).map(item => (
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
					onClick={onWaterNow}
					disabled={isWateringPending}
					className='mt-6 inline-flex w-full items-center justify-center gap-3 rounded-[20px] border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3.5 text-base font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] transition hover:-translate-y-0.5 hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed disabled:opacity-70'
				>
					<Droplets size={20} />
					Полить сейчас
				</button>
			</div>
		</div>
	)
}

