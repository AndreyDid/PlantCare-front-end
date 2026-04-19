'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { userPlantService } from '../services/userPlant.service'
import { PlantForm } from '../types/plants.types'

import { Heading } from './ui/Heading'
import { Button } from './ui/buttons/Button'
import { Field } from './ui/fields/Field'

export function CreatePlantForm() {
	const { register, handleSubmit, reset } = useForm<PlantForm>()

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: PlantForm) => userPlantService.create(data),
		onSuccess() {
			toast.success('Растение успешно добавлено!')
			queryClient.invalidateQueries({
				queryKey: ['userPlants']
			})
			reset()
		}
	})

	const onSubmit: SubmitHandler<PlantForm> = data => {
		mutate(data)
	}

	return (
		<div>
			<form
				className='w-100 m-auto shadow bg-sidebar rounded-xl p-layout'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Heading title='Добавить растение' />

				<Field
					id='plantName'
					label='Наименование'
					placeholder='Введите название'
					type='string'
					extra='mb-6'
					{...register('plantName', {
						required: 'Поле обязательно для заполнения'
					})}
				/>

				<Field
					id='nickname'
					label='Название'
					placeholder='Введите название вашего растения'
					type='text'
					extra='mb-4'
					{...register('nickname', {
						required: 'Поле обязательно для заполнения'
					})}
				/>

				<div className='flex items-center gap-5 justify-end'>
					<Button type='submit'>Добавить</Button>
				</div>
			</form>
		</div>
	)
}
