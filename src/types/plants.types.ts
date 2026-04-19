export interface PlantForm {
	plantName: string
	nickname: string
}

export interface GetPlant {
	id: string
	nickname: string
	plantName: string
	photoUrl: string | null
	plantTypeId: number | null
	userId: string
	lastWateredAt: string | null
	nextWateringAt: string | null
	createdAt: string
	updatedAt: string
}
