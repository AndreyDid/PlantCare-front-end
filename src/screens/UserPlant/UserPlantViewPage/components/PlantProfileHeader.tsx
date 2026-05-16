import { ArrowLeft, Pencil } from 'lucide-react'

interface PlantProfileHeaderProps {
	title: string
	onBack: () => void
	onEdit: () => void
}

export function PlantProfileHeader({
	title,
	onBack,
	onEdit
}: PlantProfileHeaderProps) {
	return (
		<div className='mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between'>
			<div>
				<p className='mb-3 text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
					Plant Profile
				</p>
				<h1 className='text-2xl font-semibold text-white sm:text-3xl'>
					{title}
				</h1>
			</div>
			<div className='flex flex-col gap-3 sm:flex-row'>
				<button
					type='button'
					className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-5 py-3 text-sm font-medium text-emerald-50 transition hover:bg-emerald-300/15 sm:w-auto'
					onClick={onEdit}
				>
					<Pencil size={18} />
					Редактировать
				</button>
				<button
					type='button'
					className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto'
					onClick={onBack}
				>
					<ArrowLeft size={18} />
					Назад
				</button>
			</div>
		</div>
	)
}

