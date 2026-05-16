import { History } from 'lucide-react'

import { formatDateTime } from '@/src/shared/utils/date.utils'
import {
	getCareEventMeta,
	getCareEventTitle
} from '@/src/shared/utils/plant-care.utils'
import type { PlantCareEvent } from '@/src/types/plants.types'

interface CareHistoryPreviewProps {
	events: PlantCareEvent[]
	onOpenHistory: () => void
}

export function CareHistoryPreview({
	events,
	onOpenHistory
}: CareHistoryPreviewProps) {
	return (
		<div className='rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:rounded-[24px] sm:p-5'>
			<div className='mb-4 flex items-start justify-between gap-3 sm:mb-5'>
				<div className='flex min-w-0 items-center gap-2.5 sm:gap-3'>
					<div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-emerald-100 sm:h-10 sm:w-10 sm:rounded-2xl'>
						<History size={18} />
					</div>
					<div className='min-w-0'>
						<p className='text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.24em]'>
							История ухода
						</p>
						<h2 className='text-base font-semibold text-white sm:text-lg'>
							Последние события
						</h2>
					</div>
				</div>
				<button
					type='button'
					className='inline-flex h-9 w-9 shrink-0 items-center justify-center gap-0 rounded-xl border border-white/10 bg-black/15 text-[0px] font-medium text-white transition hover:bg-white/10 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-sm'
					onClick={onOpenHistory}
					aria-label='Open care history'
				>
					<History size={16} />
					Вся история
				</button>
			</div>
			{events.length ? (
				<div className='grid gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3'>
					{events.slice(0, 3).map(event => (
						<article
							key={event.id}
							className='rounded-2xl border border-white/8 bg-black/10 p-3 sm:rounded-[20px] sm:p-4'
						>
							<p className='text-xs font-semibold text-white sm:text-sm'>
								{getCareEventTitle(event)}
							</p>
							<time className='mt-2 block text-xs text-white/45'>
								{formatDateTime(event.eventAt)}
							</time>
							{getCareEventMeta(event) ? (
								<p className='mt-2 text-xs text-emerald-100/70'>
									{getCareEventMeta(event)}
								</p>
							) : null}
						</article>
					))}
				</div>
			) : (
				<div className='rounded-2xl border border-dashed border-white/12 bg-black/10 p-3.5 text-xs leading-5 text-white/55 sm:rounded-[20px] sm:p-5 sm:text-sm sm:leading-6'>
					История пока пустая. Добавьте первый полив, подкормку или наблюдение.
				</div>
			)}
		</div>
	)
}
