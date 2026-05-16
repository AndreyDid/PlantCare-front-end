export interface PlantForm {
	plantName: string
	nickname: string
	location?: string | null
	photoUrl?: string | null
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

export interface WateringOverview {
	dueToday: GetPlant[]
	dueTomorrow: GetPlant[]
}

export interface PlantWeatherSummary {
	city: string
	resolvedLocation: string
	periodStart: string
	periodEnd: string
	averageTemperatureC: number | null
	averageHumidityPercent: number | null
	totalPrecipitationMm: number | null
	averageVapourPressureDeficitKpa: number | null
}

export interface CurrentPlantWeatherSummary {
	city: string
	resolvedLocation: string
	observedAt: string | null
	temperatureC: number | null
	apparentTemperatureC: number | null
	humidityPercent: number | null
	precipitationMm: number | null
	windSpeedKmh: number | null
	weatherCode: number | null
	condition: string
	today: {
		temperatureMinC: number | null
		temperatureMaxC: number | null
		precipitationMm: number | null
	}
	tomorrow: {
		temperatureMinC: number | null
		temperatureMaxC: number | null
		precipitationMm: number | null
	}
}

export interface WeatherWateringOverview {
	city: string | null
	weather: CurrentPlantWeatherSummary | null
	dueTodayCount: number
	dueTomorrowCount: number
	upcomingPlantCount: number
	advice: {
		tone: 'normal' | 'attention' | 'caution'
		title: string
		text: string
		details: string[]
	}
}

export interface PlantAiSuggestion {
	plantName: string | null
	latinName: string | null
	confidence: 'low' | 'medium' | 'high'
	summary: string | null
	suggestion: UpdateUserPlant
	commonProblems: string[]
	warnings: string[]
	weather: PlantWeatherSummary | null
}

export interface SuggestPlantCareRequest {
	plantName: string
	city?: string | null
	currentValues?: Record<string, unknown>
}

export interface ExistingPlantAiRequest {
	city?: string | null
	question?: string | null
}

export interface PlantCareAnalysis {
	summary: string
	wateringStatus: 'underwatered' | 'overwatered' | 'balanced' | 'unknown'
	wateringReasoning: string
	weatherImpact: string | null
	recommendations: string[]
	risks: string[]
	nextActions: string[]
	suggestedAdjustments: UpdateUserPlant
	weather: PlantWeatherSummary | null
}

export type PlantCareEventType =
	| 'WATERING'
	| 'FERTILIZING'
	| 'REPOTTING'
	| 'OBSERVATION'
	| 'NOTE'

export interface PlantCareEvent {
	id: string
	plantId: string
	type: PlantCareEventType
	title: string | null
	description: string | null
	eventAt: string
	amountMl: number | null
	createdAt: string
	updatedAt: string
}

export interface CreatePlantCareEvent {
	type: PlantCareEventType
	title?: string | null
	description?: string | null
	eventAt?: string | null
	amountMl?: number | null
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
	wateringNotes: string | null

	lastWateredAt: string | null
	nextWateringAt: string | null
	wateringIntervalDays: number | null
	wateringIntervalSpringDays: number | null
	wateringIntervalSummerDays: number | null
	wateringIntervalAutumnDays: number | null
	wateringIntervalWinterDays: number | null
	careEvents?: PlantCareEvent[]
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
		| 'wateringNotes'
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
		| 'wateringNotes'
	>
>
