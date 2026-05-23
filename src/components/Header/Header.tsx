'use client'

import cn from 'clsx'
import { Leaf, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

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
	},
	{
		label: 'История',
		href: DASHBOARD_PAGES.HISTORY
	},
	{
		label: 'Профиль',
		href: DASHBOARD_PAGES.PROFILE
	}
]

export function Header() {
	const pathname = usePathname()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const hasActiveLink = navLinks.some(link =>
		link.exact
			? pathname === link.href
			: pathname === link.href || pathname.startsWith(`${link.href}/`)
	)

	return (
		<header className='sticky top-0 z-[100] border-b border-white/12 bg-[#07110d]/85 px-3 py-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-4 sm:py-3'>
			<div className='mx-auto flex max-w-7xl items-center justify-between gap-3'>
				<Link
					href={DASHBOARD_PAGES.HOME}
					className='flex min-w-0 items-center gap-2'
				>
					<Leaf size={18} />
					<p className='truncate text-[11px] uppercase tracking-[0.22em] text-emerald-100/60 sm:text-xs sm:tracking-[0.32em]'>
						Plant Care
					</p>
				</Link>
				<nav className='hidden gap-6 md:flex lg:gap-8'>
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
				<div className='hidden md:block'>
					<LogoutButton />
				</div>
				<button
					type='button'
					className='inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/15 text-white transition hover:bg-white/10 md:hidden'
					aria-label='Toggle navigation menu'
					aria-expanded={isMenuOpen}
					onClick={() => setIsMenuOpen(value => !value)}
				>
					{isMenuOpen ? <X size={18} /> : <Menu size={18} />}
				</button>
			</div>
			<div
				className={cn(
					'mx-auto grid max-w-7xl overflow-hidden transition-[grid-template-rows,opacity] duration-200 md:hidden',
					isMenuOpen
						? 'grid-rows-[1fr] opacity-100'
						: 'grid-rows-[0fr] opacity-0'
				)}
			>
				{isMenuOpen ? (
					<div className='min-h-0'>
						<nav className='mt-3 grid gap-2 border-t border-white/10 pt-3'>
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
										onClick={() => setIsMenuOpen(false)}
										className={cn(
											'rounded-2xl px-3 py-2.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors',
											isActive
												? 'bg-emerald-300/10 text-emerald-100'
												: 'text-emerald-100/60 hover:bg-white/8 hover:text-emerald-100'
										)}
									>
										{link.label}
									</Link>
								)
							})}
							<LogoutButton className='mt-1 w-full justify-center py-2.5 text-sm' />
						</nav>
					</div>
				) : null}
			</div>
		</header>
	)
}
