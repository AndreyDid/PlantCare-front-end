import { Sparkles } from 'lucide-react'
import type { FormEventHandler } from 'react'
import type { UseFormRegister } from 'react-hook-form'

import { PlantAiSuggestionCard } from '@/src/components/PlantAiSuggestionCard'
import { Button } from '@/src/components/ui/buttons/Button'
import { Field } from '@/src/components/ui/fields/Field'
import { Modal } from '@/src/components/ui/modal/Modal'
import { nullableNumber } from '@/src/shared/utils/nullable.utils'
import type {
	PlantAiSuggestion,
	UpdateUserPlant
} from '@/src/types/plants.types'

interface PlantEditModalProps {
	aiCity: string
	aiSuggestion: PlantAiSuggestion | null
	isOpen: boolean
	isAiSuggestPending: boolean
	isPending: boolean
	onAiCityChange: (city: string) => void
	onAiSuggest: () => void
	onClose: () => void
	onPhotoChange: (file: File | null) => void
	onSubmit: FormEventHandler<HTMLFormElement>
	register: UseFormRegister<UpdateUserPlant>
}

export function PlantEditModal({
	aiCity,
	aiSuggestion,
	isOpen,
	isAiSuggestPending,
	isPending,
	onAiCityChange,
	onAiSuggest,
	onClose,
	onPhotoChange,
	onSubmit,
	register
}: PlantEditModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Редактировать растение'
			titleId='edit-plant-title'
			eyebrow='Plant Settings'
			description='Измените только те поля, которые действительно нужны для ухода. На карточке останется краткая сводка.'
			closeLabel='Закрыть редактирование'
			closeOnOverlayClick={!isPending}
			className='max-w-5xl'
		>
			<form onSubmit={onSubmit}>
				<div className='mb-6 rounded-[22px] border border-white/10 bg-white/[0.04] p-4'>
					<div className='grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end'>
						<Field
							id='editAiCity'
							label='Город для учета погоды'
							placeholder='Например, Москва'
							type='text'
							value={aiCity}
							onChange={event => onAiCityChange(event.target.value)}
						/>
						<Button
							type='button'
							disabled={isAiSuggestPending || isPending}
							className='h-[52px] rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-4 py-3 text-emerald-50 hover:bg-emerald-300/15'
							onClick={onAiSuggest}
						>
							<Sparkles size={17} />
							{isAiSuggestPending ? 'Заполняем...' : 'Заполнить через ИИ'}
						</Button>
					</div>
					<PlantAiSuggestionCard
						suggestion={aiSuggestion}
						className='mt-4'
					/>
				</div>

				<div className='grid gap-x-4 sm:grid-cols-2'>
					<Field
						id='plantName'
						label='Название растения'
						placeholder='Например, Monstera Deliciosa'
						type='text'
						extra='mb-4'
						{...register('plantName', {
							required: 'Поле обязательно для заполнения'
						})}
					/>
					<Field
						id='nickname'
						label='Домашнее имя'
						placeholder='Например, Зелёный сосед'
						type='text'
						extra='mb-6'
						{...register('nickname', {
							required: 'Поле обязательно для заполнения'
						})}
					/>
					<Field
						id='location'
						label='Локация'
						placeholder='Например, кухня, окно в спальне'
						type='text'
						extra='mb-6'
						{...register('location')}
					/>
					<Field
						id='photoUrl'
						label='URL фотографии'
						placeholder='Ссылка на фото растения'
						type='text'
						extra='mb-6'
						{...register('photoUrl')}
					/>
					<div className='mb-6 sm:col-span-2'>
						<label
							htmlFor='plantPhoto'
							className='ml-1.5 text-sm font-medium tracking-[0.02em] text-white/72'
						>
							Фото растения
						</label>
						<input
							id='plantPhoto'
							type='file'
							accept='image/*'
							capture='environment'
							className='mt-2 w-full rounded-[18px] border border-white/10 bg-white/6 px-4 py-3.5 text-base text-white outline-none transition duration-200 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-emerald-200 focus:border-emerald-300/70 focus:bg-white/8'
							onChange={event => {
								onPhotoChange(event.target.files?.[0] ?? null)
							}}
						/>
					</div>
					<Field
						id='lightLevel'
						label='Свет'
						placeholder='Укажите свет для растения'
						type='text'
						extra='mb-6'
						{...register('lightLevel')}
					/>
					<Field
						id='wateringAmountMl'
						label='Объем полива'
						placeholder='Объем полива, мл'
						type='number'
						extra='mb-6'
						isNumber
						{...register('wateringAmountMl', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='lastWateredAt'
						label='Дата последнего полива'
						placeholder='Дата последнего полива'
						type='date'
						extra='mb-6'
						{...register('lastWateredAt')}
					/>
					<Field
						id='nextWateringAt'
						label='Дата следующего полива'
						placeholder='Дата следующего полива'
						type='date'
						extra='mb-6'
						{...register('nextWateringAt')}
					/>
					<Field
						id='wateringIntervalDays'
						label='Базовый интервал полива'
						placeholder='Например, 7 дней'
						type='number'
						min={1}
						extra='mb-6'
						isNumber
						{...register('wateringIntervalDays', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='wateringIntervalSpringDays'
						label='Весенний интервал полива'
						placeholder='Например, 7 дней'
						type='number'
						min={1}
						extra='mb-6'
						isNumber
						{...register('wateringIntervalSpringDays', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='wateringIntervalSummerDays'
						label='Летний интервал полива'
						placeholder='Например, 5 дней'
						type='number'
						min={1}
						extra='mb-6'
						isNumber
						{...register('wateringIntervalSummerDays', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='wateringIntervalAutumnDays'
						label='Осенний интервал полива'
						placeholder='Например, 12 дней'
						type='number'
						min={1}
						extra='mb-6'
						isNumber
						{...register('wateringIntervalAutumnDays', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='wateringIntervalWinterDays'
						label='Зимний интервал полива'
						placeholder='Например, 10 дней'
						type='number'
						min={1}
						extra='mb-6'
						isNumber
						{...register('wateringIntervalWinterDays', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='wateringNotes'
						label='Заметка по поливу'
						placeholder='Например, полил чуть меньше из-за влажного грунта'
						type='text'
						extra='mb-6'
						{...register('wateringNotes')}
					/>
					<Field
						id='fertilizingIntervalDays'
						label='Интервал удобрения'
						placeholder='Например, 14 дней'
						type='number'
						extra='mb-6'
						isNumber
						{...register('fertilizingIntervalDays', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='lastFertilizedAt'
						label='Дата последнего удобрения'
						placeholder='Дата последнего удобрения'
						type='date'
						extra='mb-6'
						{...register('lastFertilizedAt')}
					/>
					<Field
						id='nextFertilizingAt'
						label='Дата следующего удобрения'
						placeholder='Дата следующего удобрения'
						type='date'
						extra='mb-6'
						{...register('nextFertilizingAt')}
					/>
					<Field
						id='lastRepottedAt'
						label='Дата последней пересадки'
						placeholder='Дата последней пересадки'
						type='date'
						extra='mb-6'
						{...register('lastRepottedAt')}
					/>
					<Field
						id='nextRepottingAt'
						label='Дата следующей пересадки'
						placeholder='Дата следующей пересадки'
						type='date'
						extra='mb-6'
						{...register('nextRepottingAt')}
					/>
					<Field
						id='humidityMin'
						label='Минимальная влажность'
						placeholder='Минимальная влажность, %'
						type='number'
						extra='mb-6'
						isNumber
						{...register('humidityMin', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='humidityMax'
						label='Максимальная влажность'
						placeholder='Максимальная влажность, %'
						type='number'
						extra='mb-6'
						isNumber
						{...register('humidityMax', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='potSize'
						label='Размер горшка'
						placeholder='Например, 12 см'
						type='text'
						extra='mb-6'
						{...register('potSize')}
					/>
					<Field
						id='potType'
						label='Тип горшка'
						placeholder='Например, керамический'
						type='text'
						extra='mb-6'
						{...register('potType')}
					/>
					<Field
						id='soilType'
						label='Тип почвы'
						placeholder='Например, универсальный грунт'
						type='text'
						extra='mb-6'
						{...register('soilType')}
					/>
					<Field
						id='temperatureMin'
						label='Минимальная температура'
						placeholder='Минимальная температура, °C'
						type='number'
						extra='mb-6'
						isNumber
						{...register('temperatureMin', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='temperatureMax'
						label='Максимальная температура'
						placeholder='Максимальная температура, °C'
						type='number'
						extra='mb-6'
						isNumber
						{...register('temperatureMax', {
							setValueAs: nullableNumber
						})}
					/>
				</div>
				<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
					<Button
						type='button'
						className='rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-white hover:bg-white/10'
						onClick={onClose}
					>
						Отмена
					</Button>
					<Button
						type='submit'
						disabled={isPending}
						className='rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed disabled:opacity-70'
					>
						{isPending ? 'Сохраняем...' : 'Сохранить'}
					</Button>
				</div>
			</form>
		</Modal>
	)
}
