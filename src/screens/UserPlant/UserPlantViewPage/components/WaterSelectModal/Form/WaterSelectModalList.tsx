import { Clock3, Sprout } from 'lucide-react'
import Image from 'next/image'

import { getPlantTitle } from '@/src/shared/utils/getPlantTitle'
import { formatWateringDate } from '@/src/shared/utils/getWateringDate'
import { GetPlant } from '@/src/types/plants.types'

export function WaterSelectModalList({
	isSelected,
	togglePlant,
	plant
}: {
	isSelected: boolean
	togglePlant: (value: string) => void
	plant: GetPlant
}) {
	return (
		<label className='flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]'>
			<input
				type='checkbox'
				checked={isSelected}
				onChange={() => togglePlant(plant.id)}
				className='h-5 w-5 shrink-0 accent-emerald-300'
			/>

			<div
				key={plant.id}
				className='flex items-center justify-between gap-3 min-w-0 flex-1'
			>
				<div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-emerald-300/10 text-emerald-100'>
					{plant.photoUrl ? (
						<Image
							src={plant.photoUrl}
							alt={getPlantTitle(plant)}
							fill
							unoptimized
							sizes='48px'
							className='object-cover'
						/>
					) : (
						<div className='flex h-full w-full items-center justify-center'>
							<Sprout size={20} />
						</div>
					)}
				</div>

				<div className='min-w-0 flex-1'>
					<p className='truncate font-medium text-white'>
						{getPlantTitle(plant)}
					</p>
					<p className='mt-1 truncate text-xs text-white/55'>
						{plant.plantName || 'Комнатное растение'}
					</p>
				</div>
				<div
					className={`flex shrink-0 items-center gap-2 text-right text-xs sm:text-sm `}
				>
					<Clock3 size={15} />
					<span>{formatWateringDate(plant.nextWateringAt)}</span>
				</div>
			</div>
		</label>
	)
}
