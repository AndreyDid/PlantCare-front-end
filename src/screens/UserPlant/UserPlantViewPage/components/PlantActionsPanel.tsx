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
		<div className='rounded-[24px] border border-white/10 bg-white/5 p-5'>
			<p className='text-[11px] uppercase tracking-[0.24em] text-white/45'>
				Действия
			</p>
			<div className='mt-4 grid gap-3'>
				<button
					type='button'
					onClick={onAddEvent}
					className='inline-flex items-center justify-center gap-3 rounded-[18px] border border-emerald-200/20 bg-emerald-300/10 px-5 py-3 text-sm font-medium text-emerald-50 transition hover:bg-emerald-300/15'
				>
					<Plus size={18} />
					Добавить событие
				</button>
				<button
					type='button'
					onClick={onAnalyzeCare}
					className='inline-flex items-center justify-center gap-3 rounded-[18px] border border-emerald-200/20 bg-emerald-300/10 px-5 py-3 text-sm font-medium text-emerald-50 transition hover:bg-emerald-300/15'
				>
					<Sparkles size={18} />
					Анализ ухода ИИ
				</button>
				<button
					type='button'
					onClick={onEdit}
					className='inline-flex items-center justify-center gap-3 rounded-[18px] border border-white/10 bg-black/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10'
				>
					<Pencil size={18} />
					Редактировать
				</button>
				<button
					type='button'
					onClick={onDuplicate}
					className='inline-flex items-center justify-center gap-3 rounded-[18px] border border-white/10 bg-black/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10'
				>
					<Copy size={18} />
					Скопировать растение
				</button>
			</div>
		</div>
	)
}
