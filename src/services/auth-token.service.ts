import Cookies from 'js-cookie'

const isProduction = process.env.NODE_ENV === 'production'
const accessTokenCookieOptions = {
	sameSite: 'strict' as const,
	secure: isProduction
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
		...accessTokenCookieOptions,
		expires: 1
	})
}

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN, accessTokenCookieOptions)
	Cookies.remove(EnumTokens.ACCESS_TOKEN, {
		...accessTokenCookieOptions,
		domain: 'localhost'
	})
}
