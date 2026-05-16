import { CloudSun, Sparkles } from 'lucide-react'

import { Button } from '@/src/components/ui/buttons/Button'
import { Field } from '@/src/components/ui/fields/Field'
import { Modal } from '@/src/components/ui/modal/Modal'
import type { PlantCareAnalysis } from '@/src/types/plants.types'

interface PlantCareAnalysisModalProps {
	analysis: PlantCareAnalysis | null
	city: string
	isOpen: boolean
	isPending: boolean
	question: string
	onAnalyze: () => void
	onApplyAdjustments: () => void
	onCityChange: (city: string) => void
	onClose: () => void
	onQuestionChange: (question: string) => void
}

const statusLabels: Record<PlantCareAnalysis['wateringStatus'], string> = {
	underwatered: 'похоже на недолив',
	overwatered: 'похоже на перелив',
	balanced: 'похоже на нормальный режим',
	unknown: 'недостаточно данных'
}

function AnalysisList({ title, items }: { title: string; items: string[] }) {
	if (!items.length) return null

	return (
		<div className='rounded-2xl border border-white/10 bg-black/10 p-4'>
			<p className='text-sm font-semibold text-white'>{title}</p>
			<ul className='mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-white/68'>
				{items.map(item => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</div>
	)
}

export function PlantCareAnalysisModal({
	analysis,
	city,
	isOpen,
	isPending,
	question,
	onAnalyze,
	onApplyAdjustments,
	onCityChange,
	onClose,
	onQuestionChange
}: PlantCareAnalysisModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Анализ ухода'
			titleId='plant-care-analysis-title'
			eyebrow='AI Care Review'
			description='ИИ учитывает карточку растения, историю ухода и погоду за последний месяц, если указан город.'
			closeLabel='Закрыть анализ'
			closeOnOverlayClick={!isPending}
			className='max-w-4xl'
		>
			<div className='grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end'>
				<Field
					id='analysisCity'
					label='Город'
					placeholder='Например, Москва'
					type='text'
					value={city}
					onChange={event => onCityChange(event.target.value)}
				/>
				<Button
					type='button'
					disabled={isPending}
					className='h-[52px] rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-4 py-3 text-emerald-50 hover:bg-emerald-300/15'
					onClick={onAnalyze}
				>
					<Sparkles size={17} />
					{isPending ? 'Анализируем...' : 'Проанализировать'}
				</Button>
			</div>

			<div className='mt-4'>
				<label
					htmlFor='analysisQuestion'
					className='ml-1.5 text-sm font-medium tracking-[0.02em] text-white/72'
				>
					Вопрос или наблюдение
				</label>
				<textarea
					id='analysisQuestion'
					value={question}
					onChange={event => onQuestionChange(event.target.value)}
					placeholder='Например, нормально ли я поливаю это растение?'
					className='mt-2 min-h-28 w-full resize-y rounded-[18px] border border-white/10 bg-white/6 px-4 py-3.5 text-base text-white outline-none transition duration-200 placeholder:font-normal placeholder:text-white/30 focus:border-emerald-300/70 focus:bg-white/8'
				/>
			</div>

			{analysis ? (
				<div className='mt-6 space-y-4'>
					<div className='rounded-[22px] border border-emerald-200/15 bg-emerald-300/10 p-4'>
						<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
							<p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100/70'>
								Оценка полива
							</p>
							<span className='rounded-full border border-white/10 bg-black/15 px-3 py-1 text-xs text-white/72'>
								{statusLabels[analysis.wateringStatus]}
							</span>
						</div>
						<p className='mt-3 text-sm leading-6 text-white/78'>
							{analysis.summary}
						</p>
						<p className='mt-3 text-sm leading-6 text-white/62'>
							{analysis.wateringReasoning}
						</p>
					</div>

					{analysis.weather ? (
						<div className='rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/68'>
							<p className='inline-flex items-center gap-2 font-medium text-white/82'>
								<CloudSun size={17} />
								Погода: {analysis.weather.resolvedLocation}
							</p>
							<p className='mt-2 leading-6'>
								{analysis.weather.periodStart} - {analysis.weather.periodEnd};
								средняя температура{' '}
								{analysis.weather.averageTemperatureC ?? 'нет'}°C, влажность{' '}
								{analysis.weather.averageHumidityPercent ?? 'нет'}%.
							</p>
							{analysis.weatherImpact ? (
								<p className='mt-2 leading-6'>{analysis.weatherImpact}</p>
							) : null}
						</div>
					) : null}

					<div className='grid gap-4 lg:grid-cols-3'>
						<AnalysisList
							title='Рекомендации'
							items={analysis.recommendations}
						/>
						<AnalysisList
							title='Риски'
							items={analysis.risks}
						/>
						<AnalysisList
							title='Следующие действия'
							items={analysis.nextActions}
						/>
					</div>

					<Button
						type='button'
						className='w-full rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-white hover:bg-white/10'
						onClick={onApplyAdjustments}
					>
						Применить рекомендации в форму редактирования
					</Button>
				</div>
			) : null}
		</Modal>
	)
}
