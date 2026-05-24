import Cookies from 'js-cookie'

const ACCESS_TOKEN_EXPIRES_DAYS = 15 / 60 / 24
let isClearingAuthSession = false

const getAccessTokenCookieOptions = () => {
	const isHttps =
		typeof window !== 'undefined' && window.location.protocol === 'https:'

	return {
		sameSite: 'strict' as const,
		secure: isHttps
	}
}

export enum EnumTokens {
	'ACCESS_TOKEN' = 'accessToken',
	'REFRESH_TOKEN' = 'refreshToken'
}

export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
	return accessToken || null
}

export const saveTokenStorage = (accessToken: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		...getAccessTokenCookieOptions(),
		expires: ACCESS_TOKEN_EXPIRES_DAYS
	})
}

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN, getAccessTokenCookieOptions())
	Cookies.remove(EnumTokens.ACCESS_TOKEN, {
		...getAccessTokenCookieOptions(),
		domain: 'localhost'
	})
}

export const clearAuthSession = () => {
	if (isClearingAuthSession) return

	isClearingAuthSession = true
	removeFromStorage()

	if (typeof window === 'undefined') return

	const isAuthPage =
		window.location.pathname === '/' ||
		window.location.pathname === '/auth' ||
		window.location.pathname.startsWith('/auth/')

	if (!isAuthPage) {
		window.location.assign('/auth')
	}
}
