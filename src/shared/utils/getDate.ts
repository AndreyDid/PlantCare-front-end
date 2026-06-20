export function getDate(date?: string | null) {
	if (!date) return null

	const parsedDate = new Date(date)

	return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}
