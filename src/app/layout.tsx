import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import { Toaster } from 'sonner'

import { SITE_NAME } from '../constants/seo.constants'

import './globals.scss'
import { Providers } from './providers'

const zen = Noto_Sans({
	subsets: ['cyrillic', 'latin'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-zen',
	style: ['normal']
})

export const metadata: Metadata = {
	title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
	description: 'Приложение для отслеживания состояния комнатных растений'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='ru'
			className={zen.variable}
		>
			<body className='flex min-h-screen flex-col'>
				<Providers>
					{children}
					<Toaster
						position='top-center'
						duration={1500}
						toastOptions={{
							classNames: {
								toast:
									'!rounded-2xl !border !border-white/10 !bg-[#0d1a15]/95 !text-white !shadow-[0_20px_60px_rgba(0,0,0,0.35)]',
								description: '!text-white/65',
								actionButton:
									'!bg-emerald-300 !text-slate-950',
								cancelButton: '!bg-white/10 !text-white'
							}
						}}
					></Toaster>
				</Providers>
			</body>
		</html>
	)
}
