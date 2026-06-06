import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/src/constants/seo.constants'
import { GalleryPage } from '@/src/screens/Gallery/GalleryPage'

export const metadata: Metadata = {
	title: 'Gallery',
	...NO_INDEX_PAGE
}

export default function Page() {
	return <GalleryPage />
}
