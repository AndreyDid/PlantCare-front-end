import { NextRequest, NextResponse } from 'next/server'

import { DASHBOARD_PAGES } from './config/pages-url.config'
import { EnumTokens } from './services/auth-token.service'

export async function proxy(request: NextRequest) {
	const { cookies, nextUrl } = request
	const { pathname } = nextUrl

	const hasAccessToken = Boolean(cookies.get(EnumTokens.ACCESS_TOKEN)?.value)
	const hasRefreshToken = Boolean(cookies.get(EnumTokens.REFRESH_TOKEN)?.value)
	const hasSession = hasAccessToken || hasRefreshToken
	const isAuthPage =
		pathname === '/' || pathname === '/auth' || pathname.startsWith('/auth/')
	const isDashboardPage =
		pathname === DASHBOARD_PAGES.HOME ||
		pathname.startsWith(`${DASHBOARD_PAGES.HOME}/`)

	if (isAuthPage && hasSession) {
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, request.url))
	}

	if (isDashboardPage && !hasSession) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/', '/i/:path*', '/auth/:path*']
}
