import axios, { type CreateAxiosDefaults } from 'axios'

import {
	clearAuthSession,
	getAccessToken,
} from '../services/auth-token.service'

import { errorCatch } from './error'
import type { AuthResponse } from '../types/auth.types'

const API_URL = (
	process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4200/api'
).replace(/\/$/, '')

const options: CreateAxiosDefaults = {
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

axiosWithAuth.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config
		const isUnauthorized =
			error?.response?.status === 401 ||
			errorCatch(error) === 'jwt expired' ||
			errorCatch(error) === 'jwt must be provided'

		if (
			isUnauthorized &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true
			try {
				const response = await axiosClassic.post<AuthResponse>(
					'/auth/login/access-token'
				)

				if (response.data.accessToken) {
					const { saveTokenStorage } = await import(
						'../services/auth-token.service'
					)

					saveTokenStorage(response.data.accessToken)
				}

				return axiosWithAuth.request(originalRequest)
			} catch {
				clearAuthSession()
			}
		}

		if (isUnauthorized) {
			clearAuthSession()
		}

		throw error
	}
)

export { axiosClassic, axiosWithAuth }
