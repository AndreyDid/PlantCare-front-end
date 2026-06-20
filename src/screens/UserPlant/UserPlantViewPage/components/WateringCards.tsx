import { Bell, CalendarDays, Check, Droplets } from 'lucide-react'
import { toast } from 'sonner'

import { WateringList } from './WateringList'
import { Button } from '@/src/components/ui/buttons/Button'
import { useWaterDueTodayUserPlants } from '@/src/hooks/userPlants'
import { WateringOverview } from '@/src/types/plants.types'

export function WateringCards({
	data
}: {
	data: WateringOverview | undefined
}) {
	const { mutate: waterDueToday, isPending: isWaterDueTodayPending } =
		useWaterDueTodayUserPlants()

	const dueToday = data?.dueToday ?? []
	const dueTomorrow = data?.dueTomorrow ?? []

	return (
		<div className='grid gap-6 lg:grid-cols-2'>
			<div className='rounded-3xl border border-white/10 bg-black/15 p-5'>
				<div className='mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
					<div className='flex items-center gap-3'>
						<div className='flex h-8 w-8 items-center justify-center rounded- bg-emerald-300/12 text-emerald-100'>
							<Droplets size={10} />
						</div>
						<div>
							<h3 className='text-base font-semibold text-white'>
								Полить сегодня
							</h3>
							<p className='text-sm text-white/50'>
								Сегодняшние и просроченные
							</p>
						</div>
					</div>
					<Button
						type='button'
						disabled={!dueToday.length || isWaterDueTodayPending}
						className='rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-4 py-2.5 font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.22)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed'
						onClick={() => {
							waterDueToday(undefined, {
								onSuccess: plants => {
									toast.success(
										plants.length
											? 'Актуальные растения политы'
											: 'На сегодня поливов нет'
									)
								}
							})
						}}
					>
						<Check size={17} />
						{isWaterDueTodayPending ? 'Поливаем...' : 'Полить все'}
					</Button>
				</div>

				<WateringList
					plants={dueToday}
					emptyText='На сегодня и просроченных поливов нет.'
				/>
			</div>

			<div className='rounded-3xl border border-white/10 bg-black/15 p-5'>
				<div className='mb-5 flex items-center justify-between gap-3'>
					<div className='flex items-center gap-3'>
						<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300/12 text-lime-100'>
							<CalendarDays size={20} />
						</div>
						<div>
							<h2 className='text-base font-semibold text-white'>
								Ближайший полив
							</h2>
							<p className='text-sm text-white/50'>Нужно полить завтра</p>
						</div>
					</div>
					<Bell
						className='text-emerald-100/50'
						size={19}
					/>
				</div>

				<WateringList
					plants={dueTomorrow}
					emptyText='На завтра поливов нет.'
				/>
			</div>
		</div>
	)
}
