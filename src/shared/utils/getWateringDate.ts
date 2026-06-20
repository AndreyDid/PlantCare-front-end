import { getDate } from './getDate'
import { getDaysUntil } from './getDayUtils'

export function formatWateringDate(date?: string | null) {
	const parsedDate = getDate(date)

	if (!parsedDate) return 'Дата не указана'

	const daysUntil = getDaysUntil(date)
	const formattedDate = new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'short'
	}).format(parsedDate)

	if (daysUntil === null) return formattedDate
	if (daysUntil < 0) return `Просрочено: ${formattedDate}`
	if (daysUntil === 0) return `Сегодня, ${formattedDate}`
	if (daysUntil === 1) return `Завтра, ${formattedDate}`

	return formattedDate
}
