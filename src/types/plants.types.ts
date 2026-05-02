export interface PlantForm {
	plantName: string
	nickname: string
	location?: string | null
	wateringIntervalDays?: number | null
	wateringIntervalSpringDays?: number | null
	wateringIntervalSummerDays?: number | null
	wateringIntervalAutumnDays?: number | null
	wateringIntervalWinterDays?: number | null
}

export interface GetPlant {
	id: string
	nickname: string
	plantName: string
	location: string | null
	photoUrl: string | null
	plantTypeId: string | null
	userId: string
	lastWateredAt: string | null
	nextWateringAt: string | null
	wateringIntervalDays: number | null
	wateringIntervalSpringDays: number | null
	wateringIntervalSummerDays: number | null
	wateringIntervalAutumnDays: number | null
	wateringIntervalWinterDays: number | null
	createdAt: string
	updatedAt: string
}

export interface GetUserPlantById {
	id: string
	nickname: string
	plantName: string
	location: string | null
	photoUrl: string | null
	plantTypeId: string | null
	lightLevel: string | null
	fertilizingIntervalDays: number | null

	lastFertilizedAt: string | null
	nextFertilizingAt: string | null

	lastRepottedAt: string | null
	nextRepottingAt: string | null

	humidityMax: number | null
	humidityMin: number | null

	potSize: string | null
	potType: string | null
	soilType: string | null
	temperatureMax: number | null
	temperatureMin: number | null
	wateringAmountMl: number | null

	lastWateredAt: string | null
	nextWateringAt: string | null
	wateringIntervalDays: number | null
	wateringIntervalSpringDays: number | null
	wateringIntervalSummerDays: number | null
	wateringIntervalAutumnDays: number | null
	wateringIntervalWinterDays: number | null
	createdAt: string
	updatedAt: string
}

export type UpdateUserPlant = Partial<
	Pick<
		GetUserPlantById,
		| 'nickname'
		| 'plantName'
		| 'location'
		| 'photoUrl'
		| 'plantTypeId'
		| 'lastWateredAt'
		| 'nextWateringAt'
		| 'wateringIntervalDays'
		| 'wateringIntervalSpringDays'
		| 'wateringIntervalSummerDays'
		| 'wateringIntervalAutumnDays'
		| 'wateringIntervalWinterDays'
		| 'lightLevel'
		| 'fertilizingIntervalDays'
		| 'humidityMax'
		| 'humidityMin'
		| 'lastFertilizedAt'
		| 'lastRepottedAt'
		| 'nextFertilizingAt'
		| 'nextRepottingAt'
		| 'potSize'
		| 'potType'
		| 'soilType'
		| 'temperatureMax'
		| 'temperatureMin'
		| 'wateringAmountMl'
	>
>

export type CreateUserPlant = Partial<
	Pick<
		GetUserPlantById,
		| 'nickname'
		| 'plantName'
		| 'location'
		| 'photoUrl'
		| 'plantTypeId'
		| 'lastWateredAt'
		| 'nextWateringAt'
		| 'wateringIntervalDays'
		| 'wateringIntervalSpringDays'
		| 'wateringIntervalSummerDays'
		| 'wateringIntervalAutumnDays'
		| 'wateringIntervalWinterDays'
		| 'lightLevel'
		| 'fertilizingIntervalDays'
		| 'humidityMax'
		| 'humidityMin'
		| 'lastFertilizedAt'
		| 'lastRepottedAt'
		| 'nextFertilizingAt'
		| 'nextRepottingAt'
		| 'potSize'
		| 'potType'
		| 'soilType'
		| 'temperatureMax'
		| 'temperatureMin'
		| 'wateringAmountMl'
	>
>
