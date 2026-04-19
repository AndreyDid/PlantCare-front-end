import { removeFromStorage, saveTokenStorage } from './auth-token.service'
import { axiosClassic } from '@/src/api/interceptors'
import { AuthForm, AuthResponse } from '@/src/types/auth.types'

export const authService = {
	async main(type: 'login' | 'register', data: AuthForm) {
		const response = await axiosClassic.post<AuthResponse>(
			`/auth/${type}`,
			data
		)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	},

	async getNewTokens() {
		const response = await axiosClassic.post<AuthResponse>(
			'/auth/login/access-token'
		)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	},

	async logout() {
		const response = await axiosClassic.post<boolean>('/auth/logout')

		if (response.data) removeFromStorage()

		return response
	}
}
