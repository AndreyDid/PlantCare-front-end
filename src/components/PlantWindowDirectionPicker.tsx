import cn from 'clsx'
import { Compass } from 'lucide-react'

import {
	getWindowPlacementPlantDefaults,
	getWindowPlacements,
	getWindowPlacementSubtitle,
	getWindowPlacementTitle,
	windowDirectionCareOptions
} from '@/src/shared/utils/window-direction.utils'

interface PlantWindowDirectionPickerProps {
	directions?: string[] | null
	onSelect: (values: { location: string; lightLevel: string }) => void
}

export function PlantWindowDirectionPicker({
	directions,
	onSelect
}: PlantWindowDirectionPickerProps) {
	const placements = getWindowPlacements(directions)

	if (!placements.length) {
		return (
			<div className='mb-4 rounded-[18px] border border-dashed border-white/12 bg-white/[0.03] p-4'>
				<div className='flex items-start gap-3'>
					<div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-emerald-100/70'>
						<Compass size={18} />
					</div>
					<div className='min-w-0'>
						<p className='text-sm font-medium text-white/78'>Окна не указаны</p>
						<p className='mt-1 text-xs leading-5 text-white/50'>
							Добавьте окна и их расположение в профиле, и здесь появятся
							быстрые варианты для места и света растения.
						</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='mb-4 rounded-[18px] border border-white/10 bg-white/[0.04] p-4'>
			<div className='mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
				<div className='flex min-w-0 items-start gap-3'>
					<div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-300/12 text-emerald-100'>
						<Compass size={18} />
					</div>
					<div className='min-w-0'>
						<p className='text-sm font-medium text-white/82'>
							Быстрый выбор окна
						</p>
						<p className='mt-1 text-xs leading-5 text-white/50'>
							Выберите окно из профиля, чтобы заполнить место и уровень света.
						</p>
					</div>
				</div>
				<span className='w-fit shrink-0 rounded-full border border-emerald-200/15 bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-50/75'>
					{placements.length} вариантов
				</span>
			</div>

			<div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-3'>
				{placements.map((placement, index) => {
					const option = windowDirectionCareOptions[placement.direction]
					const title = getWindowPlacementTitle(placement)
					const subtitle = getWindowPlacementSubtitle(placement)

					return (
						<button
							key={`${placement.direction}-${placement.label}-${index}`}
							type='button'
							className={cn(
								'flex min-h-[74px] items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-3 py-2.5 text-left text-white/70 transition hover:border-emerald-200/25 hover:bg-emerald-300/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07110d]'
							)}
							onClick={() => {
								onSelect(getWindowPlacementPlantDefaults(placement))
							}}
						>
							<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-emerald-100'>
								{option.shortLabel}
							</span>
							<span className='min-w-0'>
								<span className='block truncate text-sm font-semibold leading-5 text-white'>
									{title}
								</span>
								<span className='mt-0.5 block truncate text-xs leading-4 text-white/48'>
									{subtitle}
								</span>
							</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}
