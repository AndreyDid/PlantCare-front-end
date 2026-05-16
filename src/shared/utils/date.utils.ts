const DEFAULT_EMPTY_DATE_LABEL = 'Не указано'

function getValidDate(date?: string | null) {
	if (!date) return null

	const parsedDate = new Date(date)

	return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

export function formatDate(date?: string | null) {
	const parsedDate = getValidDate(date)

	if (!parsedDate) return DEFAULT_EMPTY_DATE_LABEL

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	}).format(parsedDate)
}

export function formatDateTime(date?: string | null) {
	const parsedDate = getValidDate(date)

	if (!parsedDate) return DEFAULT_EMPTY_DATE_LABEL

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(parsedDate)
}

export function toDateInputValue(date?: string | null) {
	const parsedDate = getValidDate(date)

	if (!parsedDate) return ''

	return parsedDate.toISOString().slice(0, 10)
}

export function toDateTimeInputValue(date?: string | null) {
	const parsedDate = date ? getValidDate(date) : new Date()

	if (!parsedDate) return ''

	const timezoneOffset = parsedDate.getTimezoneOffset() * 60000

	return new Date(parsedDate.getTime() - timezoneOffset)
		.toISOString()
		.slice(0, 16)
}

export function toIsoDate(date?: string | null) {
	if (!date) return null

	return new Date(date).toISOString()
}

