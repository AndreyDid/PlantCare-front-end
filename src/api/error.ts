import { isAxiosError } from 'axios'

type ErrorResponse = {
	message?: string | string[]
}

export const errorCatch = (error: unknown): string => {
	if (!isAxiosError<ErrorResponse>(error)) {
		return error instanceof Error ? error.message : 'Unknown error'
	}

	const message = error.response?.data?.message

	return message
		? Array.isArray(message)
			? message[0]
			: message
		: error.message
}
