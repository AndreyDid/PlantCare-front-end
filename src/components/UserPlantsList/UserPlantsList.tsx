'use client'

import { Sparkles } from 'lucide-react'

import { UserPlantCard } from '../UserPlantCard/UserPlantCard'

import { useUserPlants } from '@/src/hooks/userPlants'

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
	const plants = data ?? []

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
		<div
			className='grid gap-4 xl:grid-cols-4 sm:grid-cols-2 md
		:grid-cols-3'
		>
			{plants.map(plant => (
				<UserPlantCard
					key={plant.id}
					plant={plant}
				/>
			))}
		</div>
	)
}
