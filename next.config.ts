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
