import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Cross-Origin-Opener-Policy',
						value: 'same-origin'
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), geolocation=(), microphone=()'
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin'
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY'
					}
				]
			}
		]
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.mds.yandex.net'
			},
			{
				protocol: 'https',
				hostname: 'downloader.disk.yandex.ru',
				pathname: '/preview/**'
			},
			{
				protocol: 'https',
				hostname: '**.downloader.disk.yandex.ru',
				pathname: '/preview/**'
			},
			{
				protocol: 'https',
				hostname: 'plant-care-photo.website.regru.cloud',
				pathname: '/plants/**'
			},
			{
				protocol: 'https',
				hostname: 's3.regru.cloud',
				pathname: '/plant-care-photo/plants/**'
			}
		]
	}
}

export default nextConfig
