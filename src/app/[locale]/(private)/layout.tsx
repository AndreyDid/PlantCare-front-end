import { MainLayout } from '../../../components/MainLayout/MainLayout'

export default function PrivateLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return <MainLayout>{children}</MainLayout>
}
