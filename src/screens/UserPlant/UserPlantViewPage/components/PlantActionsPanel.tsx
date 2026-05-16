import { Copy, Pencil, Plus, Sparkles } from 'lucide-react'

interface PlantActionsPanelProps {
	onAddEvent: () => void
	onAnalyzeCare: () => void
	onDuplicate: () => void
	onEdit: () => void
}

export function PlantActionsPanel({
	onAddEvent,
	onAnalyzeCare,
	onDuplicate,
	onEdit
}: PlantActionsPanelProps) {
	return (
		<div className='rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:rounded-[24px] sm:p-5'>
			<p className='text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.24em]'>
				Действия
			</p>
			<div className='mt-3 grid grid-cols-2 gap-2 md:grid-cols-1 md:gap-3 lg:mt-4'>
				<button
					type='button'
					onClick={onAddEvent}
					className='inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-3 py-2.5 text-xs font-medium text-emerald-50 transition hover:bg-emerald-300/15 sm:text-sm md:gap-3 md:px-5 md:py-3'
				>
					<Plus size={18} />
					Добавить событие
				</button>
				<button
					type='button'
					onClick={onAnalyzeCare}
					className='inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-3 py-2.5 text-xs font-medium text-emerald-50 transition hover:bg-emerald-300/15 sm:text-sm md:gap-3 md:px-5 md:py-3'
				>
					<Sparkles size={18} />
					Анализ ухода ИИ
				</button>
				<button
					type='button'
					onClick={onEdit}
					className='inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-3 py-2.5 text-xs font-medium text-white transition hover:bg-white/10 sm:text-sm md:gap-3 md:px-5 md:py-3'
				>
					<Pencil size={18} />
					Редактировать
				</button>
				<button
					type='button'
					onClick={onDuplicate}
					className='inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-3 py-2.5 text-xs font-medium text-white transition hover:bg-white/10 sm:text-sm md:gap-3 md:px-5 md:py-3'
				>
					<Copy size={18} />
					Скопировать растение
				</button>
			</div>
		</div>
	)
}
