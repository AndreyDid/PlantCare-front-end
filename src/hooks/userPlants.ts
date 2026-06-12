import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { userPlantService } from '../services/userPlant.service'
import {
	CreatePlantCareEvent,
	PlantCareEventFilters,
	UpdatePlantCareEvent,
	UpdateUserPlant
} from '../types/plants.types'

export function useUserPlants() {
	const { data, isLoading } = useQuery({
		queryKey: ['userPlants'],
		queryFn: () => userPlantService.get()
	})
	return { data, isLoading }
}

export function usePhotoGallery() {
	return useQuery({
		queryKey: ['photoGallery'],
		queryFn: () => userPlantService.getPhotoGallery()
	})
}

export function useGetUserPlantsById(id: string) {
	return useQuery({
		queryKey: ['userPlants', id],
		queryFn: () => userPlantService.getById(id)
	})
}

export function useWateringOverview() {
	return useQuery({
		queryKey: ['userPlants', 'wateringOverview'],
		queryFn: () => userPlantService.getWateringOverview()
	})
}

export function useWeatherWateringOverview() {
	return useQuery({
		queryKey: ['userPlants', 'weatherWateringOverview'],
		queryFn: () => userPlantService.getWeatherWateringOverview()
	})
}

export function usePlantCareEvents(id: string) {
	return useQuery({
		queryKey: ['userPlants', id, 'careEvents'],
		queryFn: () => userPlantService.getCareEvents(id)
	})
}

export function useAllPlantCareEvents(filters: PlantCareEventFilters) {
	return useQuery({
		queryKey: ['userPlants', 'careEvents', filters],
		queryFn: () => userPlantService.getAllCareEvents(filters)
	})
}

function invalidateUserPlantQueries(
	queryClient: ReturnType<typeof useQueryClient>
) {
	queryClient.invalidateQueries({
		queryKey: ['userPlants']
	})
	queryClient.invalidateQueries({
		queryKey: ['photoGallery']
	})
}

export function useUpdateUserPlant(id: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (data: UpdateUserPlant) => userPlantService.update(id, data),
		onSuccess: () => {
			invalidateUserPlantQueries(queryClient)
		}
	})
}

export function useCreatePlantCareEvent(id: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (data: CreatePlantCareEvent) =>
			userPlantService.createCareEvent(id, data),
		onSuccess: () => {
			invalidateUserPlantQueries(queryClient)
		}
	})
}

export function useUpdatePlantCareEvent(id: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			data,
			eventId
		}: {
			data: UpdatePlantCareEvent
			eventId: string
		}) => userPlantService.updateCareEvent(id, eventId, data),
		onSuccess: () => {
			invalidateUserPlantQueries(queryClient)
		}
	})
}

export function useDeletePlantCareEvent(id: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (eventId: string) =>
			userPlantService.deleteCareEvent(id, eventId),
		onSuccess: () => {
			invalidateUserPlantQueries(queryClient)
		}
	})
}

export function useWaterAllUserPlants() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: () => userPlantService.waterAll(),
		onSuccess: () => {
			invalidateUserPlantQueries(queryClient)
		}
	})
}

export function useWaterDueTodayUserPlants() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: () => userPlantService.waterDueToday(),
		onSuccess: () => {
			invalidateUserPlantQueries(queryClient)
		}
	})
}

export function useWaterSelectedUserPlants() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (plantIds: string[]) =>
			userPlantService.waterSelected(plantIds),
		onSuccess: () => {
			invalidateUserPlantQueries(queryClient)
		}
	})
}

export function useDeleteUserPlant(id: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: () => userPlantService.delete(id),
		onSuccess: () => {
			invalidateUserPlantQueries(queryClient)
		}
	})
}

export function useDeleteGalleryPhoto() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (url: string) => userPlantService.deletePhoto(url),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['photoGallery']
			})
		}
	})
}
