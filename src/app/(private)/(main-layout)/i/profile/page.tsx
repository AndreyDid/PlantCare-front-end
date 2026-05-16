import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/src/constants/seo.constants'
import { ProfilePage } from '@/src/screens/Profile/ProfilePage'

export const metadata: Metadata = {
	title: 'Profile',
	...NO_INDEX_PAGE
}

export default function Page() {
	return <ProfilePage />
}
