'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { userPlantService } from '../services/userPlant.service'
import { PlantForm } from '../types/plants.types'

import { Button } from './ui/buttons/Button'
import { Field } from './ui/fields/Field'
import { Modal } from './ui/modal/Modal'

function nullableNumber(value?: string | number | null) {
	if (value === '' || value === null || value === undefined) return null

	const numberValue = Number(value)

	return Number.isFinite(numberValue) ? numberValue : null
}

function nullableString(value?: string | number | null) {
	if (value === null || value === undefined) return null

	const normalizedValue = String(value).trim()

	return normalizedValue ? normalizedValue : null
}

export function CreatePlantForm() {
	const [isOpen, setIsOpen] = useState(false)
	const [photoFile, setPhotoFile] = useState<File | null>(null)
	const photoPreviewUrl = useMemo(
		() => (photoFile ? URL.createObjectURL(photoFile) : null),
		[photoFile]
	)
	const { register, handleSubmit, reset } = useForm<PlantForm>()
	const queryClient = useQueryClient()

	const closeModal = () => {
		setIsOpen(false)
		setPhotoFile(null)
		reset()
	}

	useEffect(() => {
		return () => {
			if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
		}
	}, [photoPreviewUrl])

	const { mutate, isPending } = useMutation({
		mutationKey: ['createPlant'],
		mutationFn: async (data: PlantForm) => {
			const photoUrl = photoFile
				? await userPlantService.uploadPhoto(photoFile)
				: data.photoUrl

			return userPlantService.create({
				...data,
				photoUrl: nullableString(photoUrl)
			})
		},
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
				className='group flex w-full items-center justify-center gap-3 rounded-[20px] border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5  text-base font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] transition hover:-translate-y-0.5 hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 sm:w-auto'
				onClick={() => setIsOpen(true)}
			>
				<span className='flex items-center justify-center rounded-2xl text-slate-950 transition'>
					<Plus size={18} />
				</span>
				<span className='flex items-center gap-2'>Добавить растение</span>
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
						extra='mb-4'
						{...register('nickname', {
							required: 'Поле обязательно для заполнения'
						})}
					/>

					<Field
						id='location'
						label='Локация'
						placeholder='Например, кухня, окно в спальне'
						type='text'
						extra='mb-4'
						{...register('location', {
							setValueAs: nullableString
						})}
					/>

					<div className='mb-4'>
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
								setPhotoFile(event.target.files?.[0] ?? null)
							}}
						/>
						{photoPreviewUrl ? (
							<div
								aria-hidden='true'
								className='mt-3 h-36 w-full rounded-2xl bg-cover bg-center'
								style={{ backgroundImage: `url(${photoPreviewUrl})` }}
							/>
						) : null}
					</div>

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
						extra='mb-4'
						isNumber
						{...register('wateringIntervalSpringDays', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='wateringIntervalSummerDays'
						label='Летний интервал полива'
						placeholder='Например, 7 дней'
						type='number'
						min={1}
						extra='mb-4'
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
						extra='mb-4'
						isNumber
						{...register('wateringIntervalAutumnDays', {
							setValueAs: nullableNumber
						})}
					/>
					<Field
						id='wateringIntervalWinterDays'
						label='Зимний интервал полива'
						placeholder='Например, 18 дней'
						type='number'
						min={1}
						extra='mb-6'
						isNumber
						{...register('wateringIntervalWinterDays', {
							setValueAs: nullableNumber
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
