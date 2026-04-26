import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/src/constants/seo.constants'
import { UserPlantViewPage } from '@/src/screens/UserPlant/UserPlantViewPage/UserPlantViewPage'

export const metadata: Metadata = {
	title: 'Dashboard',
	...NO_INDEX_PAGE
}

export default function PlantViewPage() {
	return <UserPlantViewPage />
}
