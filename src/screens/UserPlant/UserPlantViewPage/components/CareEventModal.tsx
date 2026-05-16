import type { FormEventHandler } from 'react'
import type { UseFormRegister } from 'react-hook-form'

import { Button } from '@/src/components/ui/buttons/Button'
import { Field } from '@/src/components/ui/fields/Field'
import { Modal } from '@/src/components/ui/modal/Modal'
import { careEventTypeOptions } from '@/src/shared/utils/plant-care.utils'
import { nullableNumber } from '@/src/shared/utils/nullable.utils'
import type { CareEventForm } from '@/src/shared/utils/user-plant-form.utils'

interface CareEventModalProps {
	isOpen: boolean
	isPending: boolean
	onClose: () => void
	onSubmit: FormEventHandler<HTMLFormElement>
	register: UseFormRegister<CareEventForm>
}

export function CareEventModal({
	isOpen,
	isPending,
	onClose,
	onSubmit,
	register
}: CareEventModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Добавить событие'
			titleId='care-event-title'
			eyebrow='Care Log'
			description='Зафиксируйте полив, подкормку, пересадку или заметку. Так история остается отдельно от основной карточки.'
			closeLabel='Закрыть добавление события'
			closeOnOverlayClick={!isPending}
		>
			<form onSubmit={onSubmit}>
				<label
					htmlFor='careEventType'
					className='ml-1.5 text-sm font-medium tracking-[0.02em] text-white/72'
				>
					Тип события
				</label>
				<select
					id='careEventType'
					className='mt-2 mb-4 w-full rounded-[18px] border border-white/10 bg-[#102019] px-4 py-3.5 text-base text-white outline-none transition duration-200 focus:border-emerald-300/70 focus:bg-[#14251d]'
					{...register('type')}
				>
					{careEventTypeOptions.map(option => (
						<option
							key={option.value}
							value={option.value}
						>
							{option.label}
						</option>
					))}
				</select>
				<Field
					id='careEventAt'
					label='Дата и время'
					placeholder='Дата события'
					type='datetime-local'
					extra='mb-4'
					{...register('eventAt')}
				/>
				<Field
					id='careEventTitle'
					label='Короткое название'
					placeholder='Например, листья пожелтели'
					type='text'
					extra='mb-4'
					{...register('title')}
				/>
				<Field
					id='careEventAmount'
					label='Объем, мл'
					placeholder='Для полива, если нужно'
					type='number'
					extra='mb-4'
					isNumber
					{...register('amountMl', {
						setValueAs: nullableNumber
					})}
				/>
				<label
					htmlFor='careEventDescription'
					className='ml-1.5 text-sm font-medium tracking-[0.02em] text-white/72'
				>
					Описание
				</label>
				<textarea
					id='careEventDescription'
					rows={4}
					placeholder='Например, сегодня не поливал, похоже был перелив'
					className='mt-2 mb-5 w-full resize-none rounded-[18px] border border-white/10 bg-white/6 px-4 py-3.5 text-base text-white outline-none transition duration-200 placeholder:font-normal placeholder:text-white/30 focus:border-emerald-300/70 focus:bg-white/8'
					{...register('description')}
				/>
				<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
					<Button
						type='button'
						className='rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-white hover:bg-white/10'
						onClick={onClose}
						disabled={isPending}
					>
						Отмена
					</Button>
					<Button
						type='submit'
						disabled={isPending}
						className='rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed disabled:opacity-70'
					>
						{isPending ? 'Добавляем...' : 'Добавить событие'}
					</Button>
				</div>
			</form>
		</Modal>
	)
}

