'use client'

import cn from 'clsx'
import { Leaf } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { LogoutButton } from '../LogoutButton/LogoutButton'

import { DASHBOARD_PAGES } from '@/src/config/pages-url.config'

const navLinks = [
	{
		label: 'Главная',
		href: DASHBOARD_PAGES.HOME,
		exact: true
	},
	{
		label: 'Мои растения',
		href: DASHBOARD_PAGES.PLANTS
	}
]

export function Header() {
	const pathname = usePathname()
	const hasActiveLink = navLinks.some(link =>
		link.exact
			? pathname === link.href
			: pathname === link.href || pathname.startsWith(`${link.href}/`)
	)

	return (
		<header className='sticky top-0 z-[100] border-b border-white/12 bg-[#07110d]/80 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl'>
			<div className='mx-auto flex max-w-7xl items-center justify-between gap-4'>
				<Link href={DASHBOARD_PAGES.HOME} className='flex items-center gap-2'>
					<Leaf size={18} />
					<p className='text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
						Plant Care
					</p>
				</Link>
				<nav className='hidden gap-8 sm:flex'>
					{navLinks.map(link => {
						const isActive =
							(link.exact
								? pathname === link.href
								: pathname === link.href ||
									pathname.startsWith(`${link.href}/`)) ||
							(!hasActiveLink && link.href === DASHBOARD_PAGES.HOME)

						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									'text-xs uppercase tracking-[0.32em] transition-colors',
									isActive
										? 'text-emerald-200'
										: 'text-emerald-100/60 hover:text-emerald-100'
								)}
							>
								{link.label}
							</Link>
						)
					})}
				</nav>
				<LogoutButton />
			</div>
		</header>
	)
}
