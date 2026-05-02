'use client'

import { Droplets } from 'lucide-react'
import { toast } from 'sonner'

import { useWaterAllUserPlants } from '../hooks/userPlants'

import { Button } from './ui/buttons/Button'

export function WaterAllPlantsButton() {
	const { mutate, isPending } = useWaterAllUserPlants()

	return (
		<Button
			type='button'
			disabled={isPending}
			className='group flex w-full items-center justify-center gap-3 rounded-[20px] border border-emerald-200/20 bg-emerald-300/10 px-5 py-2.5 text-base font-semibold text-emerald-50 shadow-[0_18px_36px_rgba(72,187,120,0.12)] transition hover:-translate-y-0.5 hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto'
			onClick={() => {
				mutate(undefined, {
					onSuccess: plants => {
						toast.success(
							plants.length
								? 'Все растения политы'
								: 'В коллекции пока нет растений'
						)
					}
				})
			}}
		>
			<Droplets size={18} />
			<span>{isPending ? 'Поливаем...' : 'Полить все растения'}</span>
		</Button>
	)
}
