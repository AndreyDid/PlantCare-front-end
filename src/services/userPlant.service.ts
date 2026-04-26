import { GetPlant, PlantForm } from '../types/plants.types'

import { axiosWithAuth } from '@/src/api/interceptors'

class UserPlantService {
	private BASE_URL = '/user/plants'

	async get() {
		const response = await axiosWithAuth.get<GetPlant[]>(this.BASE_URL)

		return response.data
	}

	async getById(id: string) {
		const response = await axiosWithAuth.get<GetPlant>(`${this.BASE_URL}/${id}`)

		return response.data
	}

	async create(data: PlantForm) {
		const response = await axiosWithAuth.post<PlantForm>(this.BASE_URL, data)

		return response.data
	}
	async delete(id: string) {
		const response = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)

		return response
	}
}

export const userPlantService = new UserPlantService()
