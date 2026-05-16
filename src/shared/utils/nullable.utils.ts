export function nullableString(value?: string | number | null) {
	if (value === null || value === undefined) return null

	const normalizedValue = String(value).trim()

	return normalizedValue ? normalizedValue : null
}

export function nullableNumber(value?: string | number | null) {
	if (value === '' || value === null || value === undefined) return null

	const numberValue = Number(value)

	return Number.isFinite(numberValue) ? numberValue : null
}

