import { getDate } from './getDate'

const DAY_MS = 1000 * 60 * 60 * 24

export function getDaysUntil(date?: string | null) {
	const parsedDate = getDate(date)

	if (!parsedDate) return null

	const today = new Date()
	const startOfToday = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate()
	)
	const startOfDate = new Date(
		parsedDate.getFullYear(),
		parsedDate.getMonth(),
		parsedDate.getDate()
	)

	return Math.round((startOfDate.getTime() - startOfToday.getTime()) / DAY_MS)
}
