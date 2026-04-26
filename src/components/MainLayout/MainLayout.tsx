import { PropsWithChildren } from 'react'

import { Header } from '../Header/Header'

export function MainLayout({ children }: PropsWithChildren) {
	return (
		<div className='w-100vw h-100vh overflow-hidden'>
			<main className='flex flex-1 flex-col'>
				<Header />
				<div className='flex flex-1 p-4 overflow-auto justify-center'>
					{children}
				</div>
			</main>
		</div>
	)
}
