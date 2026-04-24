'use client'

import { Leaf, Sparkles } from 'lucide-react'

import { useUserPlants } from '@/src/hooks/userPlants'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
	day: '2-digit',
	month: 'long',
	year: 'numeric'
})

function PlantCardSkeleton() {
	return (
		<div className='rounded-[24px] border border-white/10 bg-black/15 p-5'>
			<div className='mb-6 flex items-center justify-between gap-4'>
				<div className='space-y-3'>
					<div className='h-3 w-24 rounded-full bg-white/10' />
					<div className='h-6 w-40 rounded-full bg-white/10' />
				</div>
				<div className='h-12 w-12 rounded-2xl bg-white/10' />
			</div>
			<div className='grid gap-3 sm:grid-cols-1'>
				<div className='rounded-2xl border border-white/8 bg-white/5 p-4'>
					<div className='mb-3 h-3 w-24 rounded-full bg-white/10' />
					<div className='h-5 w-32 rounded-full bg-white/10' />
				</div>
			</div>
		</div>
	)
}

export function UserPlantsList() {
	const { data, isLoading } = useUserPlants()
	const plants = data?.data ?? []

	if (isLoading) {
		return (
			<div className='grid gap-4 xl:grid-cols-2'>
				{Array.from({ length: 4 }).map((_, index) => (
					<PlantCardSkeleton key={index} />
				))}
			</div>
		)
	}

	if (!plants.length) {
		return (
			<div className='rounded-[28px] border border-dashed border-white/15 bg-black/10 p-10 text-center'>
				<div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-200'>
					<Sparkles size={22} />
				</div>
				<h3 className='text-xl font-semibold text-white'>
					Коллекция пока пустая
				</h3>
				<p className='mx-auto mt-3 max-w-md text-sm leading-6 text-white/60'>
					Добавьте первое растение через кнопку сверху. После сохранения
					карточка сразу появится в этом разделе.
				</p>
			</div>
		)
	}

	return (
		<div className='grid gap-4 xl:grid-cols-2'>
			{plants.map(plant => (
				<article
					key={plant.id}
					className='rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(255,255,255,0.04))] p-5 shadow-[0_16px_46px_rgba(0,0,0,0.22)]'
				>
					<div className='mb-6 flex items-start justify-between gap-4'>
						<div>
							<p className='mb-2 text-xs uppercase tracking-[0.28em] text-emerald-100/55'>
								Plant Profile
							</p>
							<h3 className='text-2xl font-semibold text-white'>
								{plant.nickname || plant.plantName}
							</h3>
							<p className='mt-2 text-sm text-white/55'>
								Добавлено {dateFormatter.format(new Date(plant.createdAt))}
							</p>
						</div>
						<div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-200'>
							<Leaf size={20} />
						</div>
					</div>

					<div className='grid gap-3 sm:grid-cols-1'>
						<div className='rounded-2xl border border-white/8 bg-white/5 p-4'>
							<p className='text-xs uppercase tracking-[0.24em] text-white/45'>
								Вид
							</p>
							<p className='mt-3 text-base font-medium text-white'>
								{plant.plantName}
							</p>
						</div>
					</div>
				</article>
			))}
		</div>
	)
}
