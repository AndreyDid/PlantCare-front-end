import {
	CloudSun,
	Droplet,
	Droplets,
	MapPin,
	Thermometer,
	Wind
} from 'lucide-react'

import { WeatherWateringOverview } from '@/src/types/plants.types'

function formatWeatherMetric(value?: number | null, suffix = '') {
	return typeof value === 'number' && Number.isFinite(value)
		? `${value}${suffix}`
		: '—'
}

function formatObservedAt(value?: string | null) {
	if (!value) return null

	const date = new Date(value)

	if (Number.isNaN(date.getTime())) return null

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date)
}

function getAdviceToneClass(tone?: WeatherWateringOverview['advice']['tone']) {
	if (tone === 'caution') {
		return 'border-amber-200/20 bg-amber-300/10 text-amber-50'
	}

	if (tone === 'attention') {
		return 'border-sky-200/20 bg-sky-300/10 text-sky-50'
	}

	return 'border-emerald-200/20 bg-emerald-300/10 text-emerald-50'
}

export function WeatherWateringWidget({
	data,
	isLoading
}: {
	data?: WeatherWateringOverview
	isLoading: boolean
}) {
	if (isLoading) {
		return (
			<div className='rounded-3xl border border-white/10 bg-black/15 p-5'>
				<div className='mb-5 flex items-center gap-3'>
					<div className='h-10 w-10 rounded-2xl bg-white/10' />
					<div className='space-y-3'>
						<div className='h-4 w-32 rounded-full bg-white/10' />
						<div className='h-3 w-48 rounded-full bg-white/10' />
					</div>
				</div>
				<div className='grid gap-3 sm:grid-cols-4'>
					{Array.from({ length: 4 }).map((_, index) => (
						<div
							key={index}
							className='h-20 rounded-2xl bg-white/8'
						/>
					))}
				</div>
			</div>
		)
	}

	const weather = data?.weather
	const advice = data?.advice
	const observedAt = formatObservedAt(weather?.observedAt)
	const forecastRain =
		(weather?.today.precipitationMm ?? 0) +
		(data?.dueTomorrowCount ? (weather?.tomorrow.precipitationMm ?? 0) : 0)

	return (
		<div className='rounded-3xl border border-white/10 bg-black/15 p-5'>
			<div className='mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
				<div className='flex items-start gap-3'>
					<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-300/12 text-sky-100'>
						<CloudSun size={20} />
					</div>
					<div>
						<h2 className='text-base font-semibold text-white'>
							Погода и полив
						</h2>
						<p className='mt-1 flex flex-wrap items-center gap-2 text-sm text-white/50'>
							<MapPin size={14} />
							<span>
								{weather?.resolvedLocation || data?.city || 'Город не указан'}
							</span>
							{observedAt ? <span>обновлено {observedAt}</span> : null}
						</p>
					</div>
				</div>

				<div
					className={`rounded-2xl border px-4 py-3 ${getAdviceToneClass(
						advice?.tone
					)}`}
				>
					<p className='text-sm font-semibold'>
						{advice?.title || 'Сводка недоступна'}
					</p>
					<p className='mt-1 max-w-xl text-sm leading-6 opacity-75'>
						{advice?.text ||
							'Проверьте город в профиле и ориентируйтесь на расписание полива.'}
					</p>
				</div>
			</div>

			{weather ? (
				<div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
					<div className='rounded-2xl border border-white/8 bg-white/5 p-4'>
						<div className='mb-3 flex items-center justify-between text-white/45'>
							<span className='text-xs uppercase tracking-[0.2em]'>
								Температура
							</span>
							<Thermometer size={16} />
						</div>
						<p className='text-2xl font-semibold text-white'>
							{formatWeatherMetric(weather.temperatureC, '°C')}
						</p>
						<p className='mt-1 text-sm text-white/50'>
							ощущается{' '}
							{formatWeatherMetric(weather.apparentTemperatureC, '°C')}
						</p>
					</div>

					<div className='rounded-2xl border border-white/8 bg-white/5 p-4'>
						<div className='mb-3 flex items-center justify-between text-white/45'>
							<span className='text-xs uppercase tracking-[0.2em]'>
								Влажность
							</span>
							<Droplet size={16} />
						</div>
						<p className='text-2xl font-semibold text-white'>
							{formatWeatherMetric(weather.humidityPercent, '%')}
						</p>
						<p className='mt-1 text-sm text-white/50'>{weather.condition}</p>
					</div>

					<div className='rounded-2xl border border-white/8 bg-white/5 p-4'>
						<div className='mb-3 flex items-center justify-between text-white/45'>
							<span className='text-xs uppercase tracking-[0.2em]'>Осадки</span>
							<Droplets size={16} />
						</div>
						<p className='text-2xl font-semibold text-white'>
							{formatWeatherMetric(Number(forecastRain.toFixed(1)), ' мм')}
						</p>
					</div>

					<div className='rounded-2xl border border-white/8 bg-white/5 p-4'>
						<div className='mb-3 flex items-center justify-between text-white/45'>
							<span className='text-xs uppercase tracking-[0.2em]'>Ветер</span>
							<Wind size={16} />
						</div>
						<p className='text-2xl font-semibold text-white'>
							{formatWeatherMetric(weather.windSpeedKmh, ' км/ч')}
						</p>
					</div>
				</div>
			) : (
				<div className='rounded-2xl border border-dashed border-white/12 bg-white/[0.03] px-4 py-6 text-sm leading-6 text-white/55'>
					Погодный виджет появится после того, как в профиле будет указан город
					и сервис сможет получить прогноз.
				</div>
			)}

			{advice?.details?.length ? (
				<div className='mt-4 flex flex-wrap gap-2'>
					{advice.details.map(detail => (
						<span
							key={detail}
							className='rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/55'
						>
							{detail}
						</span>
					))}
				</div>
			) : null}
		</div>
	)
}
