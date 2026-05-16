import { ArrowLeft, Sprout } from 'lucide-react'

interface PlantNotFoundProps {
	onBack: () => void
}

export function PlantNotFound({ onBack }: PlantNotFoundProps) {
	return (
		<div className='w-full max-w-7xl'>
			<div className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl'>
				<div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-200'>
					<Sprout size={24} />
				</div>
				<h1 className='text-2xl font-semibold text-white'>
					Растение не найдено
				</h1>
				<p className='mx-auto mt-3 max-w-md text-sm leading-6 text-white/60'>
					Проверьте список растений или вернитесь к коллекции.
				</p>
				<button
					type='button'
					className='mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10'
					onClick={onBack}
				>
					<ArrowLeft size={18} />
					Назад
				</button>
			</div>
		</div>
	)
}

