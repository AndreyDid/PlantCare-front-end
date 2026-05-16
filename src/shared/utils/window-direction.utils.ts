import type { WindowDirection, WindowPlacement } from '@/src/types/auth.types'

export const WINDOW_PLACEMENT_SEPARATOR = '|'

export const windowDirectionCareOptions: Record<
	WindowDirection,
	{
		label: string
		shortLabel: string
		description: string
		location: string
		lightLevel: string
	}
> = {
	north: {
		label: 'Север',
		shortLabel: 'С',
		description: 'Мягкий рассеянный свет',
		location: 'Северное окно',
		lightLevel: 'Мягкий рассеянный свет'
	},
	east: {
		label: 'Восток',
		shortLabel: 'В',
		description: 'Утреннее солнце',
		location: 'Восточное окно',
		lightLevel: 'Утреннее солнце'
	},
	south: {
		label: 'Юг',
		shortLabel: 'Ю',
		description: 'Самое яркое окно',
		location: 'Южное окно',
		lightLevel: 'Яркий прямой свет'
	},
	west: {
		label: 'Запад',
		shortLabel: 'З',
		description: 'Солнце после обеда',
		location: 'Западное окно',
		lightLevel: 'Солнце после обеда'
	}
}

export const windowDirections = Object.keys(
	windowDirectionCareOptions
) as WindowDirection[]

function isWindowDirection(value?: string): value is WindowDirection {
	return !!value && value in windowDirectionCareOptions
}

function normalizePlacementLabel(
	value?: string | null,
	options: { trim?: boolean } = {}
) {
	const normalizedValue = value
		?.split(WINDOW_PLACEMENT_SEPARATOR)
		.join(' ')
		.replace(/\s+/g, ' ')

	return options.trim ? normalizedValue?.trim() : normalizedValue
}

export function decodeWindowPlacement(value: string): WindowPlacement | null {
	const [directionValue, ...labelParts] = value.split(WINDOW_PLACEMENT_SEPARATOR)

	if (!isWindowDirection(directionValue)) return null

	return {
		direction: directionValue,
		label: normalizePlacementLabel(labelParts.join(WINDOW_PLACEMENT_SEPARATOR)) ?? ''
	}
}

export function encodeWindowPlacement(placement: WindowPlacement) {
	const label = normalizePlacementLabel(placement.label)

	return label
		? `${placement.direction}${WINDOW_PLACEMENT_SEPARATOR}${label}`
		: placement.direction
}

export function getWindowPlacements(values?: string[] | null): WindowPlacement[] {
	return (values ?? [])
		.map(decodeWindowPlacement)
		.filter((placement): placement is WindowPlacement => Boolean(placement))
}

export function normalizeWindowPlacementEntries(values?: string[] | null) {
	const seen = new Set<string>()

	return getWindowPlacements(values).reduce<string[]>((entries, placement) => {
		const encodedPlacement = encodeWindowPlacement({
			...placement,
			label: normalizePlacementLabel(placement.label, { trim: true }) ?? ''
		})

		if (seen.has(encodedPlacement)) return entries

		seen.add(encodedPlacement)
		entries.push(encodedPlacement)

		return entries
	}, [])
}

export function createWindowPlacementEntry(
	direction: WindowDirection = 'east',
	label = 'Новое окно'
) {
	return encodeWindowPlacement({
		direction,
		label
	})
}

export function getWindowPlacementTitle(placement: WindowPlacement) {
	const option = windowDirectionCareOptions[placement.direction]
	const label = normalizePlacementLabel(placement.label, { trim: true })

	return label ? label : option.location
}

export function getWindowPlacementSubtitle(placement: WindowPlacement) {
	const option = windowDirectionCareOptions[placement.direction]

	return placement.label
		? `${option.location}, ${option.description.toLowerCase()}`
		: option.description
}

export function getWindowPlacementPlantDefaults(placement: WindowPlacement) {
	const option = windowDirectionCareOptions[placement.direction]
	const label = normalizePlacementLabel(placement.label, { trim: true })

	return {
		location: label
			? `${label}, ${option.location.toLowerCase()}`
			: option.location,
		lightLevel: option.lightLevel
	}
}
