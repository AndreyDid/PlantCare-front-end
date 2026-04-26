import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { userPlantService } from '../services/userPlant.service'

export function useUserPlants() {
	const { data, isLoading } = useQuery({
		queryKey: ['userPlants'],
		queryFn: () => userPlantService.get()
	})
	return { data, isLoading }
}

export function useGetUserPlantsById(id: string) {
	return useQuery({
		queryKey: ['userPlants'],
		queryFn: () => userPlantService.getById(id)
	})
}

export function useDeleteUserPlant(id: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: () => userPlantService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['userPlants']
			})
		}
	})
}
