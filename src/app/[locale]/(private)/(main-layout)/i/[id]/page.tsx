import { BellRing, Flower2, Leaf, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'

import { CreatePlantForm } from '@/src/components/CreatePlantForm'
import { Header } from '@/src/components/Header/Header'
import { LogoutButton } from '@/src/components/LogoutButton/LogoutButton'
import { UserPlantsList } from '@/src/components/UserPlantsList/UserPlantsList'
import { NO_INDEX_PAGE } from '@/src/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Dashboard',
	...NO_INDEX_PAGE
}

export default function PlantViewPage() {
	return (
		<div className='relative min-h-screen overflow-x-hidden'>plantView</div>
	)
}
