import { PropsWithChildren } from 'react'

import { Header } from '../Header/Header'

export function MainLayout({ children }: PropsWithChildren) {
	return (
		<div className='min-h-screen'>
			<Header />
			<main className='flex min-h-[calc(100vh-57px)] justify-center px-4 py-6 sm:px-6 lg:px-8'>
				{children}
			</main>
		</div>
	)
}
