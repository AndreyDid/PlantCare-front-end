'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Leaf, Plus } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { userPlantService } from '../services/userPlant.service'
import { PlantForm } from '../types/plants.types'

import { Button } from './ui/buttons/Button'
import { Field } from './ui/fields/Field'
import { Modal } from './ui/modal/Modal'

export function CreatePlantForm() {
	const [isOpen, setIsOpen] = useState(false)
	const { register, handleSubmit, reset } = useForm<PlantForm>()
	const queryClient = useQueryClient()

	const closeModal = () => {
		setIsOpen(false)
		reset()
	}

	const { mutate, isPending } = useMutation({
		mutationKey: ['createPlant'],
		mutationFn: (data: PlantForm) => userPlantService.create(data),
		onSuccess() {
			toast.success('Растение успешно добавлено!')
			queryClient.invalidateQueries({
				queryKey: ['userPlants']
			})
			closeModal()
		}
	})

	const onSubmit: SubmitHandler<PlantForm> = data => {
		mutate(data)
	}

	return (
		<>
			<Button
				type='button'
				className='group flex w-full items-center justify-center gap-3 rounded-[20px] border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3.5 text-base font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] transition hover:-translate-y-0.5 hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 sm:w-auto'
				onClick={() => setIsOpen(true)}
			>
				<span className='flex h-10 w-10 items-center justify-center rounded-2xl bg-black/10 text-slate-950 transition group-hover:bg-black/15'>
					<Plus size={18} />
				</span>
				<span className='flex items-center gap-2'>
					<Leaf size={18} />
					Добавить растение
				</span>
			</Button>

			<Modal
				isOpen={isOpen}
				onClose={closeModal}
				title='Добавить растение'
				titleId='create-plant-title'
				eyebrow='New Plant'
				description='Заполните основные данные, чтобы новое растение сразу появилось в вашей коллекции.'
				closeLabel='Закрыть окно'
			>
				<form onSubmit={handleSubmit(onSubmit)}>
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

					<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
						<Button
							type='button'
							className='rounded-2xl border border-white/10 bg-black/15 px-5 py-3 text-white hover:bg-white/10'
							onClick={closeModal}
						>
							Отмена
						</Button>
						<Button
							type='submit'
							disabled={isPending}
							className='rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed disabled:opacity-70'
						>
							{isPending ? 'Сохраняем...' : 'Добавить растение'}
						</Button>
					</div>
				</form>
			</Modal>
		</>
	)
}
