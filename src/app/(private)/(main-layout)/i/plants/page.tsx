import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/src/constants/seo.constants'
import { DashboardPage } from '@/src/screens/Dashboard/DashboardPage'

export const metadata: Metadata = {
	title: 'My Plants',
	...NO_INDEX_PAGE
}

export default function PlantsPage() {
	return <DashboardPage />
}
