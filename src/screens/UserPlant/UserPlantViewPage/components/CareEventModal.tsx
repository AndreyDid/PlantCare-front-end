import { ImagePlus, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import type { ChangeEvent, FormEventHandler } from 'react'
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
	mode?: 'create' | 'edit'
	photoFileName?: string | null
	photoPreviewUrl?: string | null
	onClose: () => void
	onPhotoChange: (file: File | null) => void
	onPhotoRemove: () => void
	onSubmit: FormEventHandler<HTMLFormElement>
	register: UseFormRegister<CareEventForm>
}

export function CareEventModal({
	isOpen,
	isPending,
	mode = 'create',
	photoFileName,
	photoPreviewUrl,
	onClose,
	onPhotoChange,
	onPhotoRemove,
	onSubmit,
	register
}: CareEventModalProps) {
	const isEditMode = mode === 'edit'
	const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
		onPhotoChange(event.target.files?.[0] ?? null)
		event.target.value = ''
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEditMode ? 'Редактировать событие' : 'Добавить событие'}
			titleId='care-event-title'
			eyebrow='Care Log'
			description={
				isEditMode
					? 'Обновите дату, описание, фото или тип записи в истории ухода.'
					: 'Зафиксируйте полив, подкормку, пересадку или заметку. Так история остается отдельно от основной карточки.'
			}
			closeLabel={
				isEditMode
					? 'Закрыть редактирование события'
					: 'Закрыть добавление события'
			}
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
				<div className='mb-5'>
					<div className='mb-2 flex items-center justify-between gap-3'>
						<label
							htmlFor='careEventPhoto'
							className='ml-1.5 text-sm font-medium tracking-[0.02em] text-white/72'
						>
							Фото к событию
						</label>
						{photoPreviewUrl ? (
							<button
								type='button'
								className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/15 text-white/60 transition hover:bg-red-400/10 hover:text-red-100'
								onClick={onPhotoRemove}
								disabled={isPending}
								aria-label='Убрать фото события'
							>
								<Trash2 size={15} />
							</button>
						) : null}
					</div>
					{photoPreviewUrl ? (
						<div className='relative aspect-[4/3] overflow-hidden rounded-[18px] border border-white/10 bg-black/15'>
							<Image
								src={photoPreviewUrl}
								alt=''
								fill
								unoptimized
								sizes='(max-width: 640px) 100vw, 520px'
								className='object-cover'
							/>
							{photoFileName ? (
								<div className='absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-white/14 bg-black/35 px-3 py-1 text-xs text-white/75 backdrop-blur-md'>
									{photoFileName}
								</div>
							) : null}
						</div>
					) : (
						<label className='flex cursor-pointer items-center justify-center gap-2 rounded-[18px] border border-dashed border-white/14 bg-white/[0.035] px-4 py-5 text-sm font-medium text-white/62 transition hover:border-emerald-200/35 hover:bg-emerald-300/10 hover:text-emerald-50'>
							<ImagePlus size={18} />
							Загрузить фото
							<input
								id='careEventPhoto'
								type='file'
								accept='image/*'
								className='sr-only'
								disabled={isPending}
								onChange={handlePhotoChange}
							/>
						</label>
					)}
					{photoPreviewUrl ? (
						<label className='mt-3 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10'>
							<Upload size={16} />
							Заменить фото
							<input
								id='careEventPhoto'
								type='file'
								accept='image/*'
								className='sr-only'
								disabled={isPending}
								onChange={handlePhotoChange}
							/>
						</label>
					) : null}
				</div>
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
						{isPending
							? isEditMode
								? 'Сохраняем...'
								: 'Добавляем...'
							: isEditMode
								? 'Сохранить изменения'
								: 'Добавить событие'}
					</Button>
				</div>
			</form>
		</Modal>
	)
}
