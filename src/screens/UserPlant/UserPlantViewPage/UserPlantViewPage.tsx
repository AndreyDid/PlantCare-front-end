'use client'

import {
	ArrowLeft,
	CalendarDays,
	Droplets,
	Flower2,
	Leaf,
	Sprout
} from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { useGetUserPlantsById } from '@/src/hooks/userPlants'

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
	const id = String(params.id)

	const { data, isLoading } = useGetUserPlantsById(id)

	if (isLoading) return <PlantViewSkeleton />

	if (!data) {
		return (
			<div className='w-full max-w-7xl'>
				<div className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl'>
					<div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-200'>
						<Sprout size={24} />
					</div>
					<h1 className='text-2xl font-semibold text-white'>Растение не найдено</h1>
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
			<section className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8'>
				<div className='mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<p className='mb-3 text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
							Plant Profile
						</p>
						<h1 className='text-2xl font-semibold text-white sm:text-3xl'>
							{title}
						</h1>
					</div>
					<button
						type='button'
						className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto'
						onClick={() => router.back()}
					>
						<ArrowLeft size={18} />
						Назад
					</button>
				</div>

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
							<p className='mt-3 text-sm leading-6 text-white/55'>
								Карточка растения из вашей коллекции с датами ухода и ближайшим
								поливом.
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

						<button
							type='button'
							className='mt-6 inline-flex w-full items-center justify-center gap-3 rounded-[20px] border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3.5 text-base font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] transition hover:-translate-y-0.5 hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200'
						>
							<Droplets size={20} />
							Полить сейчас
						</button>
					</div>
				</div>
			</section>
		</div>
	)
}
