import { Leaf } from 'lucide-react'

import { LogoutButton } from '../LogoutButton/LogoutButton'

export function Header() {
	return (
		<div className='sticky top-0 z-100 border-b border-white/12 px-4 py-2 backdrop-blur-md bg-emerald-600/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] mb-4'>
			<div className='flex justify-between items-center '>
				<div className='flex gap-2 align-center'>
					<Leaf size={18} />
					<p className='text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
						Plant Care
					</p>
				</div>
				<div className='flex gap-8'>
					<p className='text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
						Главная
					</p>
					<p className='text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
						Мои растения
					</p>
				</div>
				<LogoutButton />
			</div>
		</div>
	)
}
