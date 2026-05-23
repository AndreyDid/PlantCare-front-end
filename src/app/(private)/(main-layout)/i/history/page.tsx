import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/src/constants/seo.constants'
import { CareHistoryPage } from '@/src/screens/CareHistory/CareHistoryPage'

export const metadata: Metadata = {
	title: 'Care History',
	...NO_INDEX_PAGE
}

export default function HistoryPage() {
	return <CareHistoryPage />
}
