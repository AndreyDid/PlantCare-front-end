import cn from 'clsx'
import { CloudSun, Sparkles } from 'lucide-react'

import type { PlantAiSuggestion } from '@/src/types/plants.types'

interface PlantAiSuggestionCardProps {
	suggestion: PlantAiSuggestion | null
	className?: string
}

const confidenceLabels: Record<PlantAiSuggestion['confidence'], string> = {
	low: 'низкая',
	medium: 'средняя',
	high: 'высокая'
}

export function PlantAiSuggestionCard({
	suggestion,
	className
}: PlantAiSuggestionCardProps) {
	if (!suggestion) return null

	return (
		<div
			className={cn(
				'rounded-[22px] border border-emerald-200/15 bg-emerald-300/10 p-4 text-sm text-emerald-50',
				className
			)}
		>
			<div className='flex items-center justify-between gap-3'>
				<p className='inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100/70'>
					<Sparkles size={15} />
					ИИ-черновик
				</p>
				<span className='rounded-full border border-white/10 bg-black/15 px-3 py-1 text-xs text-white/70'>
					Уверенность: {confidenceLabels[suggestion.confidence]}
				</span>
			</div>

			{suggestion.summary ? (
				<p className='mt-3 leading-6 text-white/78'>{suggestion.summary}</p>
			) : null}

			{suggestion.latinName ? (
				<p className='mt-2 text-white/55'>
					Латинское название:{' '}
					<span className='font-medium text-white/80'>
						{suggestion.latinName}
					</span>
				</p>
			) : null}

			{suggestion.weather ? (
				<div className='mt-3 rounded-2xl border border-white/10 bg-black/10 p-3 text-white/68'>
					<p className='inline-flex items-center gap-2 font-medium text-white/80'>
						<CloudSun size={16} />
						Погода: {suggestion.weather.resolvedLocation}
					</p>
					<p className='mt-1 text-xs leading-5'>
						{suggestion.weather.periodStart} - {suggestion.weather.periodEnd},{' '}
						средняя температура{' '}
						{suggestion.weather.averageTemperatureC ?? 'нет'}°C, влажность{' '}
						{suggestion.weather.averageHumidityPercent ?? 'нет'}%.
					</p>
				</div>
			) : null}

			{suggestion.commonProblems.length ? (
				<div className='mt-3'>
					<p className='font-medium text-white/80'>Частые проблемы</p>
					<ul className='mt-2 list-disc space-y-1 pl-5 text-white/65'>
						{suggestion.commonProblems.map(problem => (
							<li key={problem}>{problem}</li>
						))}
					</ul>
				</div>
			) : null}

			{suggestion.warnings.length ? (
				<div className='mt-3'>
					<p className='font-medium text-white/80'>Что проверить вручную</p>
					<ul className='mt-2 list-disc space-y-1 pl-5 text-white/65'>
						{suggestion.warnings.map(warning => (
							<li key={warning}>{warning}</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	)
}
