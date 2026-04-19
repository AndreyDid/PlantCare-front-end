import type { Metadata } from 'next'

import { CreatePlantForm } from '@/src/components/CreatePlantForm'
import { LogoutButton } from '@/src/components/LogoutButton/LogoutButton'
import { UserPlantsList } from '@/src/components/UserPlantsList/UserPlantsList'
import { Heading } from '@/src/components/ui/Heading'
import { NO_INDEX_PAGE } from '@/src/constants/seo.constants'

// import { Statistics } from './Statistics'

export const metadata: Metadata = {
	title: 'Dashboard',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div className='flex  justify-between'>
			<div>
				<div className='flex'>
					<div>
						<div className='flex justify-between'>
							<Heading title='Профиль' />
						</div>
						<UserPlantsList />
					</div>
					<div>
						<CreatePlantForm />
					</div>
				</div>
				<LogoutButton />
			</div>
		</div>
	)
}
