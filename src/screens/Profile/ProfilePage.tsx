'use client'

import cn from 'clsx'
import { Compass, Loader2, MapPin, Save, UserRound } from 'lucide-react'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/src/components/ui/buttons/Button'
import { Field } from '@/src/components/ui/fields/Field'
import { useUpdateUserProfile, useUserProfile } from '@/src/hooks/userProfile'
import type { TypeUserForm, WindowDirection } from '@/src/types/auth.types'

const directionOptions: {
	value: WindowDirection
	label: string
	shortLabel: string
	description: string
}[] = [
	{
		value: 'north',
		label: 'Север',
		shortLabel: 'С',
		description: 'Мягкий рассеянный свет'
	},
	{
		value: 'east',
		label: 'Восток',
		shortLabel: 'В',
		description: 'Утреннее солнце'
	},
	{
		value: 'south',
		label: 'Юг',
		shortLabel: 'Ю',
		description: 'Самое яркое окно'
	},
	{
		value: 'west',
		label: 'Запад',
		shortLabel: 'З',
		description: 'Солнце после обеда'
	}
]

function nullableString(value?: string | null) {
	if (value === undefined) return undefined

	const normalizedValue = value?.trim()

	return normalizedValue ? normalizedValue : null
}

function ProfileSkeleton() {
	return (
		<div className='w-full max-w-7xl rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8'>
			<div className='mb-8 border-b border-white/10 pb-6'>
				<div className='mb-3 h-3 w-24 rounded-full bg-white/10' />
				<div className='h-9 w-56 rounded-full bg-white/10' />
				<div className='mt-4 h-4 max-w-xl rounded-full bg-white/8' />
			</div>
			<div className='grid gap-4 md:grid-cols-3'>
				{Array.from({ length: 3 }).map((_, index) => (
					<div
						key={index}
						className='h-24 rounded-3xl border border-white/10 bg-black/15'
					/>
				))}
			</div>
			<div className='mt-6 grid gap-4 sm:grid-cols-2'>
				{Array.from({ length: 4 }).map((_, index) => (
					<div
						key={index}
						className='h-20 rounded-3xl bg-white/8'
					/>
				))}
			</div>
		</div>
	)
}

export function ProfilePage() {
	const { data, isLoading } = useUserProfile()
	const updateProfileMutation = useUpdateUserProfile()
	const { register, control, handleSubmit, reset, setValue } =
		useForm<TypeUserForm>({
			defaultValues: {
				windowDirections: []
			}
		})
	const selectedDirections =
		useWatch({
			control,
			name: 'windowDirections'
		}) ?? []

	useEffect(() => {
		if (!data?.user) return

		reset({
			email: data.user.email,
			name: data.user.name ?? '',
			city: data.user.city ?? '',
			windowDirections: data.user.windowDirections ?? [],
			password: ''
		})
	}, [data, reset])

	const toggleDirection = (direction: WindowDirection) => {
		const nextDirections = selectedDirections.includes(direction)
			? selectedDirections.filter(item => item !== direction)
			: [...selectedDirections, direction]

		setValue('windowDirections', nextDirections, {
			shouldDirty: true
		})
	}

	const onSubmit = handleSubmit(formValues => {
		const password = nullableString(formValues.password)
		const payload: TypeUserForm = {
			email: formValues.email.trim(),
			name: nullableString(formValues.name),
			city: nullableString(formValues.city),
			windowDirections: formValues.windowDirections ?? []
		}

		if (password) payload.password = password

		updateProfileMutation.mutate(payload, {
			onSuccess: result => {
				reset({
					email: result.user.email,
					name: result.user.name ?? '',
					city: result.user.city ?? '',
					windowDirections: result.user.windowDirections ?? [],
					password: ''
				})
				toast.success('Профиль обновлён')
			},
			onError: () => {
				toast.error('Не удалось обновить профиль')
			}
		})
	})

	if (isLoading) return <ProfileSkeleton />

	return (
		<div className='w-full max-w-7xl'>
			<section className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8'>
				<div className='mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between'>
					<div>
						<p className='mb-3 text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
							Profile
						</p>
						<h1 className='text-2xl font-semibold text-white sm:text-3xl'>
							Профиль пользователя
						</h1>
						<p className='mt-3 max-w-2xl text-sm leading-6 text-white/60'>
							Город и стороны света окон используются как базовый домашний
							контекст для ухода за растениями.
						</p>
					</div>
					<div className='flex items-center gap-3 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-4 py-3 text-emerald-100'>
						<UserRound size={20} />
						<span className='text-sm font-medium'>
							{data?.user.email ?? 'Аккаунт'}
						</span>
					</div>
				</div>

				{data?.statistics?.length ? (
					<div className='mb-6 grid gap-4 md:grid-cols-3'>
						{data.statistics.map(statistic => (
							<div
								key={statistic.label}
								className='rounded-3xl border border-white/10 bg-black/15 p-5'
							>
								<p className='text-xs uppercase tracking-[0.24em] text-white/42'>
									{statistic.label}
								</p>
								<p className='mt-3 text-lg font-semibold text-white'>
									{statistic.value}
								</p>
							</div>
						))}
					</div>
				) : null}

				<form onSubmit={onSubmit}>
					<div className='grid gap-x-4 sm:grid-cols-2'>
						<Field
							id='name'
							label='Имя'
							placeholder='Например, Анна'
							type='text'
							extra='mb-4'
							{...register('name')}
						/>
						<Field
							id='email'
							label='Email'
							placeholder='name@example.com'
							type='email'
							extra='mb-4'
							{...register('email', {
								required: 'Email обязателен'
							})}
						/>
						<Field
							id='city'
							label='Город'
							placeholder='Например, Москва'
							type='text'
							extra='mb-4'
							{...register('city')}
						/>
						<Field
							id='password'
							label='Новый пароль'
							placeholder='Оставьте пустым, если не меняете'
							type='password'
							extra='mb-4'
							{...register('password')}
						/>
					</div>

					<div className='mb-6 rounded-[22px] border border-white/10 bg-white/[0.04] p-4'>
						<div className='mb-4 flex items-start gap-3'>
							<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-300/12 text-emerald-100'>
								<Compass size={20} />
							</div>
							<div>
								<h2 className='text-base font-semibold text-white'>
									Куда выходят окна
								</h2>
								<p className='mt-1 text-sm leading-6 text-white/55'>
									Можно выбрать несколько сторон света, если растения стоят в
									разных комнатах.
								</p>
							</div>
						</div>

						<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
							{directionOptions.map(direction => {
								const isSelected = selectedDirections.includes(direction.value)

								return (
									<button
										key={direction.value}
										type='button'
										className={cn(
											'flex min-h-28 flex-col items-start justify-between rounded-3xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07110d]',
											isSelected
												? 'border-emerald-200/40 bg-emerald-300/15 text-white'
												: 'border-white/10 bg-black/10 text-white/70 hover:bg-white/[0.06] hover:text-white'
										)}
										onClick={() => toggleDirection(direction.value)}
									>
										<span className='flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-black/15 text-sm font-semibold text-emerald-100'>
											{direction.shortLabel}
										</span>
										<span>
											<span className='block font-semibold'>
												{direction.label}
											</span>
											<span className='mt-1 block text-xs leading-5 text-white/48'>
												{direction.description}
											</span>
										</span>
									</button>
								)
							})}
						</div>
					</div>

					<div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between'>
						<p className='inline-flex items-center gap-2 text-sm text-white/50'>
							<MapPin size={16} />
							Эти данные можно менять в любой момент.
						</p>
						<Button
							type='submit'
							disabled={updateProfileMutation.isPending}
							className='rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed'
						>
							{updateProfileMutation.isPending ? (
								<Loader2
									size={17}
									className='animate-spin'
								/>
							) : (
								<Save size={17} />
							)}
							{updateProfileMutation.isPending
								? 'Сохраняем...'
								: 'Сохранить профиль'}
						</Button>
					</div>
				</form>
			</section>
		</div>
	)
}
