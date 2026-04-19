import { useQuery } from '@tanstack/react-query'

import { userPlantService } from '../services/userPlant.service'

export function useUserPlants() {
	const { data, isLoading } = useQuery({
		queryKey: ['userPlants'],
		queryFn: () => userPlantService.get()
	})
	return { data, isLoading }
}
