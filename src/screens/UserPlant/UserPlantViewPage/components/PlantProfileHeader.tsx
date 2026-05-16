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
		<div className='mb-4 flex items-start justify-between gap-3 border-b border-white/10 pb-4 sm:mb-6 sm:items-center sm:pb-6'>
			<div className='min-w-0'>
				<p className='mb-2 text-[10px] uppercase tracking-[0.22em] text-emerald-100/60 sm:mb-3 sm:text-xs sm:tracking-[0.32em]'>
					Plant Profile
				</p>
				<h1 className='break-words text-lg font-semibold leading-tight text-white sm:text-2xl md:text-3xl'>
					{title}
				</h1>
			</div>
			<div className='flex shrink-0 gap-2 sm:gap-3'>
				<button
					type='button'
					aria-label='Edit plant'
					className='inline-flex h-10 w-10 items-center justify-center gap-0 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 text-[0px] font-medium text-emerald-50 transition hover:bg-emerald-300/15 sm:h-auto sm:w-auto sm:gap-2 sm:px-5 sm:py-3 sm:text-sm'
					onClick={onEdit}
				>
					<Pencil size={18} />
					Редактировать
				</button>
				<button
					type='button'
					aria-label='Back'
					className='inline-flex h-10 w-10 items-center justify-center gap-0 rounded-2xl border border-white/10 bg-black/15 text-[0px] font-medium text-white transition hover:bg-white/10 sm:h-auto sm:w-auto sm:gap-2 sm:px-5 sm:py-3 sm:text-sm'
					onClick={onBack}
				>
					<ArrowLeft size={18} />
					Назад
				</button>
			</div>
		</div>
	)
}
