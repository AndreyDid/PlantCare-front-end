import { GetPlant } from '@/src/types/plants.types'

export function getPlantTitle(plant: GetPlant) {
	return plant.nickname || plant.plantName || 'Без названия'
}
