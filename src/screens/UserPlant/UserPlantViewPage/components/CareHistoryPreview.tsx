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
		<div className='rounded-[24px] border border-white/10 bg-white/5 p-5'>
			<div className='mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<div className='flex items-center gap-3'>
					<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-emerald-100'>
						<History size={20} />
					</div>
					<div>
						<p className='text-[11px] uppercase tracking-[0.24em] text-white/45'>
							История ухода
						</p>
						<h2 className='text-lg font-semibold text-white'>
							Последние события
						</h2>
					</div>
				</div>
				<button
					type='button'
					className='inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10'
					onClick={onOpenHistory}
				>
					<History size={16} />
					Вся история
				</button>
			</div>
			{events.length ? (
				<div className='grid gap-3 md:grid-cols-3'>
					{events.slice(0, 3).map(event => (
						<article
							key={event.id}
							className='rounded-[20px] border border-white/8 bg-black/10 p-4'
						>
							<p className='text-sm font-semibold text-white'>
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
				<div className='rounded-[20px] border border-dashed border-white/12 bg-black/10 p-5 text-sm leading-6 text-white/55'>
					История пока пустая. Добавьте первый полив, подкормку или наблюдение.
				</div>
			)}
		</div>
	)
}

