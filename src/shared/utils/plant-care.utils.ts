import { toDateInputValue } from './date.utils'
import { nullableNumber } from './nullable.utils'

import type {
	GetUserPlantById,
	PlantCareEvent,
	PlantCareEventType,
	UpdateUserPlant
} from '@/src/types/plants.types'

export const careEventTypeLabels: Record<PlantCareEventType, string> = {
	WATERING: 'Полив',
	FERTILIZING: 'Подкормка',
	REPOTTING: 'Пересадка',
	OBSERVATION: 'Наблюдение',
	NOTE: 'Заметка'
}

export const careEventTypeOptions = Object.entries(careEventTypeLabels).map(
	([value, label]) => ({
		value: value as PlantCareEventType,
		label
	})
)

type WateringIntervalFields = Pick<
	UpdateUserPlant,
	| 'wateringIntervalDays'
	| 'wateringIntervalSpringDays'
	| 'wateringIntervalSummerDays'
	| 'wateringIntervalAutumnDays'
	| 'wateringIntervalWinterDays'
>

export function getCareEventLabel(type: PlantCareEventType) {
	return careEventTypeLabels[type] ?? 'Событие'
}

export function getCareEventTitle(event: PlantCareEvent) {
	return event.title || getCareEventLabel(event.type)
}

export function getCareEventMeta(event: PlantCareEvent) {
	const typeLabel = getCareEventLabel(event.type)
	const hasCustomTitle = Boolean(
		event.title?.trim() && event.title !== typeLabel
	)
	const metaItems: string[] = []

	if (hasCustomTitle) metaItems.push(typeLabel)
	if (event.amountMl) metaItems.push(`${event.amountMl} мл`)

	return metaItems.length ? metaItems.join(' · ') : null
}

export function sortCareEventsByDate(events: PlantCareEvent[]) {
	return [...events].sort((firstEvent, secondEvent) => {
		const eventDateDiff =
			new Date(secondEvent.eventAt).getTime() -
			new Date(firstEvent.eventAt).getTime()

		if (eventDateDiff) return eventDateDiff

		return (
			new Date(secondEvent.createdAt).getTime() -
			new Date(firstEvent.createdAt).getTime()
		)
	})
}

function getPositiveNumber(value?: string | number | null) {
	const numberValue = nullableNumber(value)

	return numberValue && numberValue > 0 ? numberValue : null
}

export function getSeasonByDate(date: Date) {
	const month = date.getUTCMonth()

	if (month >= 2 && month <= 4) return 'spring'
	if (month >= 5 && month <= 7) return 'summer'
	if (month >= 8 && month <= 10) return 'autumn'

	return 'winter'
}

export function getSeasonalWateringIntervalDays(
	date: Date,
	intervals: WateringIntervalFields
) {
	const season = getSeasonByDate(date)
	const baseInterval = getPositiveNumber(intervals.wateringIntervalDays)

	if (season === 'spring') {
		return (
			getPositiveNumber(intervals.wateringIntervalSpringDays) ?? baseInterval
		)
	}

	if (season === 'summer') {
		return (
			getPositiveNumber(intervals.wateringIntervalSummerDays) ?? baseInterval
		)
	}

	if (season === 'autumn') {
		return (
			getPositiveNumber(intervals.wateringIntervalAutumnDays) ?? baseInterval
		)
	}

	return getPositiveNumber(intervals.wateringIntervalWinterDays) ?? baseInterval
}

function addDays(date: Date, days: number) {
	const nextDate = new Date(date)

	nextDate.setUTCDate(nextDate.getUTCDate() + days)

	return nextDate
}

export function getNextWateringByInterval(
	wateredAt: Date,
	intervals: WateringIntervalFields
) {
	const intervalDays = getSeasonalWateringIntervalDays(wateredAt, intervals)

	return intervalDays ? addDays(wateredAt, intervalDays).toISOString() : null
}

export function getNextWateringInputDate(
	lastWateredAt: string | null | undefined,
	intervals: WateringIntervalFields
) {
	if (!lastWateredAt) return ''

	const wateredAt = new Date(lastWateredAt)

	if (Number.isNaN(wateredAt.getTime())) return ''

	return toDateInputValue(getNextWateringByInterval(wateredAt, intervals))
}

export function formatWateringInterval(plant: GetUserPlantById) {
	const intervalDays = getSeasonalWateringIntervalDays(new Date(), plant)

	return intervalDays ? `${intervalDays} дн.` : 'Не указано'
}

export function formatIntervalDays(value?: number | string | null) {
	const intervalDays = getPositiveNumber(value)

	return intervalDays ? `${intervalDays} дн.` : 'Не указано'
}

export function getWateringSeasonItems(plant: GetUserPlantById) {
	return [
		{
			label: 'Весна',
			value: plant.wateringIntervalSpringDays ?? plant.wateringIntervalDays
		},
		{
			label: 'Лето',
			value: plant.wateringIntervalSummerDays ?? plant.wateringIntervalDays
		},
		{
			label: 'Осень',
			value: plant.wateringIntervalAutumnDays ?? plant.wateringIntervalDays
		},
		{
			label: 'Зима',
			value: plant.wateringIntervalWinterDays ?? plant.wateringIntervalDays
		}
	]
}

export function getPlantPotLabel(plant: GetUserPlantById) {
	const potParts = [plant.potSize, plant.potType].filter(Boolean)

	return potParts.length ? potParts.join(', ') : 'Не указан'
}

