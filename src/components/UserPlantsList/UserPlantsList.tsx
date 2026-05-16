'use client'

import { Sparkles } from 'lucide-react'

import { UserPlantCard } from '../UserPlantCard/UserPlantCard'

import { useUserPlants } from '@/src/hooks/userPlants'

function PlantCardSkeleton() {
	return (
		<div className='overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045]'>
			<div className='h-36 bg-white/8 sm:h-40' />
			<div className='p-4'>
				<div className='mb-4 flex items-start justify-between gap-3'>
					<div className='space-y-2'>
						<div className='h-3 w-24 rounded-full bg-white/10' />
						<div className='h-5 w-36 rounded-full bg-white/10' />
						<div className='h-3 w-28 rounded-full bg-white/10' />
					</div>
					<div className='h-8 w-8 rounded-lg bg-white/10' />
				</div>
				<div className='mb-3 rounded-xl border border-white/8 bg-white/[0.04] p-3'>
					<div className='h-8 rounded-full bg-white/8' />
				</div>
				<div className='space-y-3 border-t border-white/8 pt-3'>
					<div className='h-8 rounded-full bg-white/8' />
					<div className='h-8 rounded-full bg-white/8' />
					<div className='h-8 rounded-full bg-white/8' />
				</div>
			</div>
		</div>
	)
}

export function UserPlantsList() {
	const { data, isLoading } = useUserPlants()
	const plants = data ?? []

	if (isLoading) {
		return (
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
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
		<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
			{plants.map(plant => (
				<UserPlantCard
					key={plant.id}
					plant={plant}
				/>
			))}
		</div>
	)
}
