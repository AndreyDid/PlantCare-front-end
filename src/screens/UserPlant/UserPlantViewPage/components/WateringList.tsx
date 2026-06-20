import { Clock3, Sprout } from 'lucide-react'
import Image from 'next/image'

import { formatCount } from '@/src/shared/utils/formatCount'
import { getDaysUntil } from '@/src/shared/utils/getDayUtils'
import { getPlantTitle } from '@/src/shared/utils/getPlantTitle'
import { formatWateringDate } from '@/src/shared/utils/getWateringDate'
import { GetPlant } from '@/src/types/plants.types'

export function WateringList({
	emptyText,
	plants
}: {
	emptyText: string
	plants: GetPlant[]
}) {
	function getPlantLocation(plant: GetPlant) {
		return plant.location?.trim() || 'Без локации'
	}

	function groupPlantsByLocation(plants: GetPlant[]) {
		return plants.reduce<{ location: string; plants: GetPlant[] }[]>(
			(groups, plant) => {
				const location = getPlantLocation(plant)
				const currentGroup = groups.find(group => group.location === location)

				if (currentGroup) {
					currentGroup.plants.push(plant)
					return groups
				}

				return [...groups, { location, plants: [plant] }]
			},
			[]
		)
	}

	const groupedPlants = groupPlantsByLocation(plants)

	if (!plants.length) {
		return (
			<div className='rounded-2xl border border-dashed border-white/12 bg-white/[0.03] px-4 py-8 text-center text-sm leading-6 text-white/55'>
				{emptyText}
			</div>
		)
	}

	return (
		<div className='max-h-[420px] space-y-4 overflow-y-auto pr-1'>
			{groupedPlants.map(group => (
				<div
					key={group.location}
					className='space-y-2'
				>
					<div className='sticky top-0 z-10 flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#0b1913]/95 px-3 py-2 text-xs backdrop-blur-md'>
						<span className='truncate font-medium text-emerald-100'>
							{group.location}
						</span>
						<span className='shrink-0 text-white/40'>
							{group.plants.length}{' '}
							{formatCount(group.plants.length, [
								'растение',
								'растения',
								'растений'
							])}
						</span>
					</div>

					<div className='flex flex-col gap-2'>
						{group.plants.map(plant => {
							const daysUntil = getDaysUntil(plant.nextWateringAt)
							const isOverdue = daysUntil !== null && daysUntil < 0

							return (
								<div
									key={plant.id}
									className='flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/5 px-3 py-2.5'
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
										className={`flex shrink-0 items-center gap-2 text-right text-xs sm:text-sm ${
											isOverdue ? 'text-red-100/80' : 'text-emerald-100/75'
										}`}
									>
										<Clock3 size={15} />
										<span>{formatWateringDate(plant.nextWateringAt)}</span>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			))}
		</div>
	)
}
