'use client'

import { useUserPlants } from '@/src/hooks/userPlants'

export function UserPlantsList() {
	const { data, isLoading } = useUserPlants()

	return (
		<div>
			{data?.data.length ? (
				data.data.map(d => (
					<div key={d.id}>
						<div>{d.plantName}</div>
						<div>{d.nickname}</div>
					</div>
				))
			) : (
				<div>Нет данных</div>
			)}
		</div>
	)
}
