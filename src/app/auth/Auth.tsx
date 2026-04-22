'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Heading } from '@/src/components/ui/Heading'
import { Button } from '@/src/components/ui/buttons/Button'
import { Field } from '@/src/components/ui/fields/Field'
import { DASHBOARD_PAGES } from '@/src/config/pages-url.config'
import { authService } from '@/src/services/auth.service'
import { AuthForm } from '@/src/types/auth.types'

export default function Auth() {
	const { register, handleSubmit, reset } = useForm<AuthForm>()
	const [isLoginForm, setIsLoginForm] = useState(false)
	const { push } = useRouter()

	const { mutate, isPending } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: AuthForm) =>
			authService.main(isLoginForm ? 'login' : 'register', data),
		onSuccess() {
			toast.success('Вход выполнен успешно!')
			reset()
			push(DASHBOARD_PAGES.HOME)
		}
	})

	const onSubmit: SubmitHandler<AuthForm> = data => {
		mutate(data)
	}

	return (
		<div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(82,178,122,0.22),_transparent_34%),linear-gradient(155deg,_#06100c_0%,_#0c1d16_52%,_#04100b_100%)] px-4 py-10 text-white'>
			<div className='absolute left-[-5rem] top-[-4rem] h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl' />
			<div className='absolute bottom-[-6rem] right-[-4rem] h-72 w-72 rounded-full bg-lime-200/10 blur-3xl' />

			<form
				className='relative z-10 w-full max-w-md rounded-[28px] border border-white/15 bg-white/10 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-2xl'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='mb-8'>
					<p className='mb-3 text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
						Plant Care
					</p>
					<div className='text-white'>
						<Heading title='Авторизация' />
					</div>
					<p className='mt-4 text-sm leading-6 text-white/65'>
						Войдите в аккаунт или создайте новый профиль для управления своими
						растениями.
					</p>
				</div>

				<div className='mb-6 grid grid-cols-2 rounded-[16px] border border-white/10 bg-black/15 p-1 gap-1'>
					<Button
						type='button'
						className={`border-0 px-4 py-3 ${
							isLoginForm
								? 'bg-white/16 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'
								: 'text-white/70 hover:bg-white/8 hover:text-white'
						}`}
						onClick={() => setIsLoginForm(true)}
					>
						Вход
					</Button>
					<Button
						type='button'
						className={`border-0 px-4 py-3 ${
							!isLoginForm
								? 'bg-white/16 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'
								: 'text-white/70 hover:bg-white/8 hover:text-white'
						}`}
						onClick={() => setIsLoginForm(false)}
					>
						Регистрация
					</Button>
				</div>

				<Field
					id='email'
					label='Email'
					placeholder='Введите email'
					type='email'
					extra='mb-4'
					{...register('email', { required: 'Невалидный email' })}
				/>
				<Field
					id='password'
					label='Пароль'
					placeholder='Введите пароль'
					type='password'
					extra='mb-6'
					{...register('password', { required: 'Невалидный пароль' })}
				/>

				<div className='flex flex-col gap-4'>
					<Button
						type='submit'
						disabled={isPending}
						className='w-full rounded-2xl border-0 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 py-3 text-base font-semibold text-slate-950 shadow-[0_18px_36px_rgba(72,187,120,0.28)] hover:from-emerald-200 hover:via-emerald-300 hover:to-lime-200 disabled:cursor-not-allowed disabled:opacity-70'
					>
						{isPending
							? 'Подождите...'
							: isLoginForm
								? 'Войти'
								: 'Создать аккаунт'}
					</Button>
					<p className='text-center text-sm text-white/50'>
						Безопасный доступ к вашему личному оранжерейному кабинету.
					</p>
				</div>
			</form>
		</div>
	)
}
