import { NextRequest, NextResponse } from 'next/server'

import { DASHBOARD_PAGES } from './config/pages-url.config'
import { EnumTokens } from './services/auth-token.service'

export async function middleware(request: NextRequest) {
	const { cookies, nextUrl } = request
	const { pathname } = nextUrl

	const hasRefreshToken = Boolean(cookies.get(EnumTokens.REFRESH_TOKEN)?.value)
	const isAuthPage = pathname === '/auth' || pathname.startsWith('/auth/')
	const isDashboardPage =
		pathname === DASHBOARD_PAGES.HOME ||
		pathname.startsWith(`${DASHBOARD_PAGES.HOME}/`)

	if (isAuthPage && hasRefreshToken) {
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, request.url))
	}

	if (isDashboardPage && !hasRefreshToken) {
		return NextResponse.redirect(new URL('/auth', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/i/:path*', '/auth/:path*']
}
