import type { FormEventHandler } from 'react'
import type { UseFormRegister } from 'react-hook-form'

import { Button } from '@/src/components/ui/buttons/Button'
import { Field } from '@/src/components/ui/fields/Field'
import { Modal } from '@/src/components/ui/modal/Modal'
import type { DuplicatePlantForm } from '@/src/shared/utils/user-plant-form.utils'

interface DuplicatePlantModalProps {
	isOpen: boolean
	isPending: boolean
	onClose: () => void
	onSubmit: FormEventHandler<HTMLFormElement>
	register: UseFormRegister<DuplicatePlantForm>
}

export function DuplicatePlantModal({
	isOpen,
	isPending,
	onClose,
	onSubmit,
	register
}: DuplicatePlantModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Скопировать растение'
			titleId='duplicate-plant-title'
			eyebrow='Duplicate Plant'
			description='Будет создано новое растение с такими же параметрами ухода. Здесь можно изменить только фото и место.'
			closeLabel='Закрыть окно'
			closeOnOverlayClick={!isPending}
		>
			<form onSubmit={onSubmit}>
				<Field
					id='duplicatePhotoUrl'
					label='URL фотографии'
					placeholder='Ссылка на фото нового растения'
					type='text'
					extra='mb-4'
					{...register('photoUrl')}
				/>
				<Field
					id='duplicateLocation'
					label='Локация'
					placeholder='Например, кухня, окно в спальне'
					type='text'
					extra='mb-6'
					{...register('location')}
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
						{isPending ? 'Создаем...' : 'Создать копию'}
					</Button>
				</div>
			</form>
		</Modal>
	)
}

