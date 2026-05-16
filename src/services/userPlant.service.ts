import {
	CreatePlantCareEvent,
	CreateUserPlant,
	GetPlant,
	GetUserPlantById,
	PlantCareEvent,
	PlantForm,
	UpdateUserPlant,
	WateringOverview
} from '../types/plants.types'

import { axiosWithAuth } from '@/src/api/interceptors'

function getAbsoluteUploadUrl(fileUrl: string) {
	if (/^https?:\/\//.test(fileUrl)) return fileUrl

	const baseUrl = axiosWithAuth.defaults.baseURL ?? ''
	const origin =
		typeof window === 'undefined'
			? baseUrl.replace(/\/api\/?$/, '')
			: new URL(baseUrl, window.location.origin).origin

	return `${origin}${fileUrl}`
}

class UserPlantService {
	private BASE_URL = '/user/plants'

	async get() {
		const response = await axiosWithAuth.get<GetPlant[]>(this.BASE_URL)

		return response.data
	}

	async getById(id: string) {
		const response = await axiosWithAuth.get<GetUserPlantById>(
			`${this.BASE_URL}/${id}`
		)

		return response.data
	}

	async getWateringOverview() {
		const response = await axiosWithAuth.get<WateringOverview>(
			`${this.BASE_URL}/watering-overview`
		)

		return response.data
	}

	async create(data: PlantForm | CreateUserPlant) {
		const response = await axiosWithAuth.post<GetUserPlantById>(
			this.BASE_URL,
			data
		)

		return response.data
	}

	async uploadPhoto(file: File) {
		const formData = new FormData()
		formData.append('file', file)

		const response = await axiosWithAuth.post<{ url: string }>(
			`${this.BASE_URL}/upload-photo`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)

		return getAbsoluteUploadUrl(response.data.url)
	}

	async update(id: string, data: UpdateUserPlant) {
		const response = await axiosWithAuth.put<GetUserPlantById>(
			`${this.BASE_URL}/${id}`,
			data
		)

		return response.data
	}

	async getCareEvents(id: string) {
		const response = await axiosWithAuth.get<PlantCareEvent[]>(
			`${this.BASE_URL}/${id}/events`
		)

		return response.data
	}

	async createCareEvent(id: string, data: CreatePlantCareEvent) {
		const response = await axiosWithAuth.post<GetUserPlantById>(
			`${this.BASE_URL}/${id}/events`,
			data
		)

		return response.data
	}

	async deleteCareEvent(id: string, eventId: string) {
		const response = await axiosWithAuth.delete<GetUserPlantById>(
			`${this.BASE_URL}/${id}/events/${eventId}`
		)

		return response.data
	}

	async waterAll() {
		const response = await axiosWithAuth.post<GetPlant[]>(
			`${this.BASE_URL}/water-all`
		)

		return response.data
	}

	async waterDueToday() {
		const response = await axiosWithAuth.post<GetPlant[]>(
			`${this.BASE_URL}/water-due-today`
		)

		return response.data
	}

	async waterSelected(plantIds: string[]) {
		const response = await axiosWithAuth.post<GetPlant[]>(
			`${this.BASE_URL}/water-selected`,
			{ plantIds }
		)

		return response.data
	}

	async delete(id: string) {
		const response = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)

		return response
	}
}

export const userPlantService = new UserPlantService()
