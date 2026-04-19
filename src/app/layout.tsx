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
			<body className='min-h-full flex flex-col'>
				<Providers>
					{children}
					<Toaster
						position='top-center'
						duration={1500}
					></Toaster>
				</Providers>
			</body>
		</html>
	)
}
