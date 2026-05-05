import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
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
			}
		]
	}
}

export default nextConfig
