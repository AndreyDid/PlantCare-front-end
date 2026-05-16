'use client'

import cn from 'clsx'
import {
	Compass,
	Loader2,
	MapPin,
	Plus,
	Save,
	Trash2,
	UserRound
} from 'lucide-react'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/src/components/ui/buttons/Button'
import { Field } from '@/src/components/ui/fields/Field'
import { useUpdateUserProfile, useUserProfile } from '@/src/hooks/userProfile'
import {
	createWindowPlacementEntry,
	decodeWindowPlacement,
	encodeWindowPlacement,
	normalizeWindowPlacementEntries,
	windowDirectionCareOptions,
	windowDirections
} from '@/src/shared/utils/window-direction.utils'
import type { TypeUserForm, WindowDirection } from '@/src/types/auth.types'

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
	const windowEntries =
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
			windowDirections: normalizeWindowPlacementEntries(
				data.user.windowDirections
			),
			password: ''
		})
	}, [data, reset])

	const updateWindowPlacement = (
		index: number,
		nextPlacement: {
			direction: WindowDirection
			label: string
		}
	) => {
		const nextEntries = [...windowEntries]
		nextEntries[index] = encodeWindowPlacement(nextPlacement)

		setValue('windowDirections', nextEntries, {
			shouldDirty: true
		})
	}

	const addWindowPlacement = () => {
		setValue(
			'windowDirections',
			[
				...windowEntries,
				createWindowPlacementEntry('east', `Новое окно ${windowEntries.length + 1}`)
			],
			{
				shouldDirty: true
			}
		)
	}

	const removeWindowPlacement = (index: number) => {
		setValue(
			'windowDirections',
			windowEntries.filter((_, itemIndex) => itemIndex !== index),
			{
				shouldDirty: true
			}
		)
	}

	const onSubmit = handleSubmit(formValues => {
		const password = nullableString(formValues.password)
		const payload: TypeUserForm = {
			email: formValues.email.trim(),
			name: nullableString(formValues.name),
			city: nullableString(formValues.city),
			windowDirections: normalizeWindowPlacementEntries(
				formValues.windowDirections
			)
		}

		if (password) payload.password = password

		updateProfileMutation.mutate(payload, {
			onSuccess: result => {
				reset({
					email: result.user.email,
					name: result.user.name ?? '',
					city: result.user.city ?? '',
					windowDirections: normalizeWindowPlacementEntries(
						result.user.windowDirections
					),
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
							<div className='min-w-0 flex-1'>
								<h2 className='text-base font-semibold text-white'>
									Окна и их расположение
								</h2>
								<p className='mt-1 text-sm leading-6 text-white/55'>
									Добавьте конкретные места: кухня, окно перед балконом,
									спальня. Потом их можно быстро выбрать в карточке растения.
								</p>
							</div>
							<Button
								type='button'
								className='h-10 shrink-0 rounded-xl border-emerald-200/20 bg-emerald-300/10 px-3 text-emerald-50 hover:bg-emerald-300/15'
								onClick={addWindowPlacement}
							>
								<Plus size={16} />
								Окно
							</Button>
						</div>

						{windowEntries.length ? (
							<div className='grid gap-3'>
								{windowEntries.map((entry, index) => {
									const placement = decodeWindowPlacement(entry) ?? {
										direction: 'east' as WindowDirection,
										label: ''
									}
									const option = windowDirectionCareOptions[placement.direction]

									return (
										<div
											key={`window-placement-${index}`}
											className='grid gap-3 rounded-2xl border border-white/10 bg-black/10 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,220px)_52px] sm:items-start'
										>
											<Field
												id={`window-label-${index}`}
												label='Где находится окно'
												placeholder='Например, кухня или окно перед балконом'
												type='text'
												extra='mb-0'
												value={placement.label}
												onChange={event =>
													updateWindowPlacement(index, {
														...placement,
														label: event.target.value
													})
												}
											/>

											<div>
												<label
													htmlFor={`window-direction-${index}`}
													className='ml-1.5 text-sm font-medium tracking-[0.02em] text-white/72'
												>
													Сторона света
												</label>
												<select
													id={`window-direction-${index}`}
													value={placement.direction}
													className='mt-2 h-[52px] w-full rounded-[18px] border border-white/10 bg-[#13231b] px-4 text-base text-white outline-none transition duration-200 focus:border-emerald-300/70 focus:bg-[#172a21]'
													onChange={event =>
														updateWindowPlacement(index, {
															...placement,
															direction: event.target.value as WindowDirection
														})
													}
												>
													{windowDirections.map(direction => (
														<option
															key={direction}
															value={direction}
														>
															{windowDirectionCareOptions[direction].label}
														</option>
													))}
												</select>
												<p className='mt-2 text-xs leading-5 text-white/45'>
													{option.description}
												</p>
											</div>

											<Button
												type='button'
												aria-label='Удалить окно'
												className='h-[52px] w-[52px] justify-self-end rounded-[18px] px-0 text-white/55 hover:border-red-200/30 hover:bg-red-400/10 hover:text-red-100 sm:mt-[29px]'
												onClick={() => removeWindowPlacement(index)}
											>
												<Trash2 size={16} />
											</Button>
										</div>
									)
								})}
							</div>
						) : (
							<button
								type='button'
								className={cn(
									'w-full rounded-2xl border border-dashed border-white/14 bg-black/10 px-4 py-6 text-left transition hover:border-emerald-200/25 hover:bg-emerald-300/10'
								)}
								onClick={addWindowPlacement}
							>
								<span className='block text-sm font-medium text-white/80'>
									Добавить первое окно
								</span>
								<span className='mt-1 block text-sm leading-6 text-white/50'>
									Например: “Кухня, восточное окно” или “Окно перед балконом,
									восточное окно”.
								</span>
							</button>
						)}
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
