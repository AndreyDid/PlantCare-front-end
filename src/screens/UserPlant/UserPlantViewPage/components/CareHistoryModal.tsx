import { Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'

import { CareEventTypeIcon } from '@/src/components/CareEventTypeIcon'
import { Modal } from '@/src/components/ui/modal/Modal'
import { formatDateTime } from '@/src/shared/utils/date.utils'
import {
	getCareEventMeta,
	getCareEventTitle
} from '@/src/shared/utils/plant-care.utils'
import type { PlantCareEvent } from '@/src/types/plants.types'

interface CareHistoryModalProps {
	events: PlantCareEvent[]
	isDeleting: boolean
	isOpen: boolean
	deletingEventId?: string
	onClose: () => void
	onDelete: (eventId: string) => void
	onEdit: (event: PlantCareEvent) => void
}

export function CareHistoryModal({
	events,
	isDeleting,
	isOpen,
	deletingEventId,
	onClose,
	onDelete,
	onEdit
}: CareHistoryModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='История ухода'
			titleId='plant-history-title'
			eyebrow='Care History'
			description='Все события растения в одном месте. Основная карточка показывает только последние записи.'
			closeLabel='Закрыть историю'
			className='max-w-3xl'
		>
			{events.length ? (
				<div className='space-y-3'>
					{events.map(event => (
						<article
							key={event.id}
							className='rounded-[20px] border border-white/8 bg-black/10 p-4'
						>
							<div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
								<div className='flex min-w-0 gap-3'>
									<div className='relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/8 text-emerald-100'>
										{event.photoUrl ? (
											<Image
												src={event.photoUrl}
												alt=''
												fill
												unoptimized
												sizes='48px'
												className='object-cover'
											/>
										) : (
											<CareEventTypeIcon
												type={event.type}
												size={19}
											/>
										)}
									</div>
									<div className='min-w-0'>
										<p className='text-sm font-semibold text-white'>
											{getCareEventTitle(event)}
										</p>
										{getCareEventMeta(event) ? (
											<p className='mt-1 text-xs text-emerald-100/70'>
												{getCareEventMeta(event)}
											</p>
										) : null}
									</div>
								</div>
								<div className='flex items-center gap-3'>
									<time className='text-xs text-white/45'>
										{formatDateTime(event.eventAt)}
									</time>
									<button
										type='button'
										aria-label='Редактировать событие'
										title='Редактировать событие'
										className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/6 text-white/55 transition hover:border-emerald-200/30 hover:bg-emerald-300/10 hover:text-emerald-50'
										onClick={() => onEdit(event)}
									>
										<Pencil size={16} />
									</button>
									<button
										type='button'
										aria-label='Удалить событие'
										title='Удалить событие'
										disabled={isDeleting && deletingEventId === event.id}
										className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/6 text-white/55 transition hover:border-red-300/30 hover:bg-red-400/10 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-50'
										onClick={() => onDelete(event.id)}
									>
										<Trash2 size={16} />
									</button>
								</div>
							</div>
							{event.description ? (
								<p className='mt-3 text-sm leading-6 text-white/65'>
									{event.description}
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
		</Modal>
	)
}
