import { toDateInputValue, toDateTimeInputValue, toIsoDate } from './date.utils'
import { getNextWateringInputDate } from './plant-care.utils'
import { nullableNumber, nullableString } from './nullable.utils'

import type {
	CreateUserPlant,
	GetUserPlantById,
	PlantCareEvent,
	PlantCareEventType,
	UpdateUserPlant
} from '@/src/types/plants.types'

export type DuplicatePlantForm = Pick<CreateUserPlant, 'photoUrl' | 'location'>

export type CareEventForm = {
	type: PlantCareEventType
	title: string
	description: string
	eventAt: string
	amountMl?: number | null
	photoUrl?: string | null
}

export function getPlantFormValues(
	plant?: GetUserPlantById | null
): UpdateUserPlant {
	if (!plant) return {}

	return {
		...plant,
		photoUrl: plant.photoUrl ?? '',
		location: plant.location ?? '',
		fertilizingIntervalDays: plant.fertilizingIntervalDays ?? undefined,
		wateringIntervalDays: plant.wateringIntervalDays ?? undefined,
		wateringIntervalSpringDays: plant.wateringIntervalSpringDays ?? undefined,
		wateringIntervalSummerDays: plant.wateringIntervalSummerDays ?? undefined,
		wateringIntervalAutumnDays: plant.wateringIntervalAutumnDays ?? undefined,
		wateringIntervalWinterDays: plant.wateringIntervalWinterDays ?? undefined,
		potSize: plant.potSize ?? '',
		potType: plant.potType ?? '',
		soilType: plant.soilType ?? '',
		wateringNotes: plant.wateringNotes ?? '',
		lastFertilizedAt: toDateInputValue(plant.lastFertilizedAt),
		nextFertilizingAt: toDateInputValue(plant.nextFertilizingAt),
		lastRepottedAt: toDateInputValue(plant.lastRepottedAt),
		nextRepottingAt: toDateInputValue(plant.nextRepottingAt),
		lastWateredAt: toDateInputValue(plant.lastWateredAt),
		nextWateringAt: toDateInputValue(plant.nextWateringAt)
	}
}

export function getCareEventFormValues(
	event?: PlantCareEvent | null
): CareEventForm {
	return {
		type: event?.type ?? 'NOTE',
		title: event?.title ?? '',
		description: event?.description ?? '',
		eventAt: toDateTimeInputValue(event?.eventAt),
		amountMl: event?.amountMl ?? null,
		photoUrl: event?.photoUrl ?? null
	}
}

export function getDuplicatePlantValues(
	plant?: GetUserPlantById | null
): DuplicatePlantForm {
	return {
		photoUrl: plant?.photoUrl ?? '',
		location: plant?.location ?? ''
	}
}

export function getDuplicatePlantPayload(
	plant: GetUserPlantById,
	formValues: DuplicatePlantForm
): CreateUserPlant {
	return {
		plantName: plant.plantName,
		nickname: plant.nickname,
		location: nullableString(formValues.location),
		photoUrl: nullableString(formValues.photoUrl),
		plantTypeId: plant.plantTypeId,
		lightLevel: plant.lightLevel,
		temperatureMin: plant.temperatureMin,
		temperatureMax: plant.temperatureMax,
		humidityMin: plant.humidityMin,
		humidityMax: plant.humidityMax,
		potType: plant.potType,
		potSize: plant.potSize,
		soilType: plant.soilType,
		lastRepottedAt: null,
		nextRepottingAt: null,
		lastWateredAt: null,
		nextWateringAt: null,
		wateringIntervalDays: plant.wateringIntervalDays,
		wateringIntervalSpringDays: plant.wateringIntervalSpringDays,
		wateringIntervalSummerDays: plant.wateringIntervalSummerDays,
		wateringIntervalAutumnDays: plant.wateringIntervalAutumnDays,
		wateringIntervalWinterDays: plant.wateringIntervalWinterDays,
		wateringAmountMl: plant.wateringAmountMl,
		wateringNotes: plant.wateringNotes,
		fertilizingIntervalDays: plant.fertilizingIntervalDays,
		lastFertilizedAt: null,
		nextFertilizingAt: null
	}
}

export function getUpdatePlantPayload(
	formValues: UpdateUserPlant,
	photoUrl?: string | null
): UpdateUserPlant {
	const nextWateringAt =
		getNextWateringInputDate(formValues.lastWateredAt, formValues) ||
		formValues.nextWateringAt

	return {
		plantName: nullableString(formValues.plantName) ?? '',
		nickname: nullableString(formValues.nickname) ?? '',
		plantTypeId: nullableString(formValues.plantTypeId),
		photoUrl: nullableString(photoUrl),
		location: nullableString(formValues.location),
		lightLevel: nullableString(formValues.lightLevel),
		temperatureMin: nullableNumber(formValues.temperatureMin),
		temperatureMax: nullableNumber(formValues.temperatureMax),
		humidityMin: nullableNumber(formValues.humidityMin),
		humidityMax: nullableNumber(formValues.humidityMax),
		fertilizingIntervalDays: nullableNumber(formValues.fertilizingIntervalDays),
		wateringIntervalDays: nullableNumber(formValues.wateringIntervalDays),
		wateringIntervalSpringDays: nullableNumber(
			formValues.wateringIntervalSpringDays
		),
		wateringIntervalSummerDays: nullableNumber(
			formValues.wateringIntervalSummerDays
		),
		wateringIntervalAutumnDays: nullableNumber(
			formValues.wateringIntervalAutumnDays
		),
		wateringIntervalWinterDays: nullableNumber(
			formValues.wateringIntervalWinterDays
		),
		wateringAmountMl: nullableNumber(formValues.wateringAmountMl),
		potSize: nullableString(formValues.potSize),
		potType: nullableString(formValues.potType),
		soilType: nullableString(formValues.soilType),
		wateringNotes: nullableString(formValues.wateringNotes),
		lastFertilizedAt: toIsoDate(formValues.lastFertilizedAt),
		nextFertilizingAt: toIsoDate(formValues.nextFertilizingAt),
		lastRepottedAt: toIsoDate(formValues.lastRepottedAt),
		nextRepottingAt: toIsoDate(formValues.nextRepottingAt),
		lastWateredAt: toIsoDate(formValues.lastWateredAt),
		nextWateringAt: toIsoDate(nextWateringAt)
	}
}
