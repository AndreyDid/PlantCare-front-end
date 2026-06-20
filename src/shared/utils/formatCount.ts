export function formatCount(count: number, labels: [string, string, string]) {
	const lastTwoDigits = count % 100
	const lastDigit = count % 10

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return labels[2]
	if (lastDigit === 1) return labels[0]
	if (lastDigit >= 2 && lastDigit <= 4) return labels[1]

	return labels[2]
}
