import { Leaf } from 'lucide-react'

import { LogoutButton } from '../LogoutButton/LogoutButton'

export function Header() {
	return (
		<header className='sticky top-0 z-[100] border-b border-white/12 bg-[#07110d]/80 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl'>
			<div className='mx-auto flex max-w-7xl items-center justify-between gap-4'>
				<div className='flex items-center gap-2'>
					<Leaf size={18} />
					<p className='text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
						Plant Care
					</p>
				</div>
				<nav className='hidden gap-8 sm:flex'>
					<p className='text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
						Главная
					</p>
					<p className='text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
						Мои растения
					</p>
				</nav>
				<LogoutButton />
			</div>
		</header>
	)
}
