import { Droplets } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { WaterSelectModalList } from '../Form/WaterSelectModalList'

import { Button } from '@/src/components/ui/buttons/Button'
import { Modal } from '@/src/components/ui/modal/Modal'
import {
	useWaterSelectedUserPlants,
	useWateringOverview
} from '@/src/hooks/userPlants'
import { formatCount } from '@/src/shared/utils/formatCount'

function Skeleton() {
	return (
		<div className='grid gap-6 '>
			{Array.from({ length: 1 }).map((_, index) => (
				<div
					key={index}
					className='rounded-3xl border border-white/10 bg-black/15 p-5'
				>
					<div className='flex items-center gap-3'>
						<div className='h-12 w-12 rounded-2xl bg-white/10' />
						<div className='space-y-3'>
							<div className='h-4 w-36 rounded-full bg-white/10' />
							<div className='h-3 w-24 rounded-full bg-white/10' />
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export function WaterSelectModal({
	isOpen,
	onClose
}: {
	isOpen: boolean
	onClose: () => void
}) {
	const { data, isLoading } = useWateringOverview()

	const dueToday = data?.dueToday ?? []
	const dueTomorrow = data?.dueTomorrow ?? []
	const allUpcomingPlants = [...dueToday, ...dueTomorrow]

	const [selectedPlantIds, setSelectedPlantIds] = useState(() =>
		dueToday.map(x => x.id)
	)

	const { mutate: waterSelected, isPending: isWaterSelectedPending } =
		useWaterSelectedUserPlants()

	const togglePlant = (plantId: string) => {
		setSelectedPlantIds(current =>
			current.includes(plantId)
				? current.filter(id => id !== plantId)
				: [...current, plantId]
		)
	}

	function handleClose() {
		setSelectedPlantIds([])
		onClose()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Выбрать растения'
			titleId='select-plants-to-water-title'
			eyebrow='Watering'
			description='Отметьте растения из сегодняшнего и завтрашнего списка, которые уже полили.'
			closeLabel='Закрыть выбор растений'
		>
			<div className='flex flex-col gap-3'>
				{isLoading ? (
					<Skeleton />
				) : (
					<>
						{allUpcomingPlants.map(plant => {
							const isSelected = selectedPlantIds.includes(plant.id)

							return (
								<WaterSelectModalList
									key={plant.id}
									isSelected={isSelected}
									togglePlant={togglePlant}
									plant={plant}
								/>
							)
						})}
					</>
				)}
			</div>

			<div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
				<Button
					type='button'
					className='rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-white hover:bg-white/10'
					onClick={handleClose}
				>
					Отмена
				</Button>
				<Button
					type='button'
					disabled={!selectedPlantIds.length || isWaterSelectedPending}
					className='rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed'
					onClick={() => {
						waterSelected(selectedPlantIds, {
							onSuccess: plants => {
								toast.success(
									`${plants.length} ${formatCount(plants.length, [
										'растение полито',
										'растения политы',
										'растений полито'
									])}`
								)
								handleClose()
							}
						})
					}}
				>
					<Droplets size={17} />
					{isWaterSelectedPending ? 'Поливаем...' : 'Полить выбранные'}
				</Button>
			</div>
		</Modal>
	)
}
