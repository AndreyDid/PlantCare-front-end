'use client'

import { Droplets, Sprout } from 'lucide-react'
import { useState } from 'react'

import { WaterSelectModal } from '../UserPlant/UserPlantViewPage/components/WaterSelectModal/Modal/WaterSelectModal'
import { WateringCards } from '../UserPlant/UserPlantViewPage/components/WateringCards'
import { WateringSkeleton } from '../UserPlant/UserPlantViewPage/components/WateringSkeleton'
import { WeatherWateringWidget } from '../UserPlant/UserPlantViewPage/components/WeatherWateringWidget'

import { Button } from '@/src/components/ui/buttons/Button'
import {
	useWateringOverview,
	useWeatherWateringOverview
} from '@/src/hooks/userPlants'
import { formatCount } from '@/src/shared/utils/formatCount'

export function HomePage() {
	const [isSelectModalOpen, setIsSelectModalOpen] = useState(false)
	const { data, isLoading } = useWateringOverview()
	const { data: weatherOverview, isLoading: isWeatherOverviewLoading } =
		useWeatherWateringOverview()

	const dueToday = data?.dueToday ?? []
	const dueTomorrow = data?.dueTomorrow ?? []
	const allUpcomingPlants = [...dueToday, ...dueTomorrow]
	const upcomingCount = allUpcomingPlants.length

	const openSelectModal = () => {
		setIsSelectModalOpen(true)
	}

	const closeSelectModal = () => {
		setIsSelectModalOpen(false)
	}

	return (
		<div className='relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6'>
			<section className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8'>
				<div className='flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between'>
					<div>
						<h2 className='mb-3  uppercase tracking-[0.32em] text-emerald-100/60'>
							Главная
						</h2>

						<p className='mt-3 max-w-2xl text-sm leading-6 text-white/60'>
							Короткая сводка по уходу: что нужно полить сегодня, что подойдет к
							сроку завтра, и быстрый выбор растений для полива.
						</p>
					</div>

					<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
						<div className='flex items-center gap-3 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-4 py-3 text-emerald-100'>
							<Sprout size={20} />
							<span className='text-sm font-medium'>
								{upcomingCount}{' '}
								{formatCount(upcomingCount, [
									'ближайший полив',
									'ближайших полива',
									'ближайших поливов'
								])}
							</span>
						</div>
						<Button
							type='button'
							disabled={!upcomingCount || isLoading}
							className='rounded-2xl border-emerald-200/20 bg-white/8 px-4 py-3 text-emerald-50 hover:bg-white/12 disabled:cursor-not-allowed'
							onClick={openSelectModal}
						>
							<Droplets size={17} />
							Полить выборочно
						</Button>
					</div>
				</div>

				<div className='mt-6'>
					<WeatherWateringWidget
						data={weatherOverview}
						isLoading={isWeatherOverviewLoading}
					/>
				</div>

				<div className='mt-6'>
					{isLoading ? <WateringSkeleton /> : <WateringCards data={data} />}
				</div>
			</section>

			<WaterSelectModal
				isOpen={isSelectModalOpen}
				onClose={closeSelectModal}
			/>
		</div>
	)
}
