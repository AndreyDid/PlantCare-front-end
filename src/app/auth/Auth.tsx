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

	const { mutate } = useMutation({
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
		<div className='flex min-h-screen'>
			<form
				className='w-1/4 m-auto shadow bg-sidebar rounded-xl p-layout'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Heading title='Авторизация' />

				<Field
					id='email'
					label='Email'
					placeholder='Введите email'
					type='email'
					extra='mb-4'
					{...register('email', { required: 'Не валидный email' })}
				/>
				<Field
					id='password'
					label='Password'
					placeholder='Введите password'
					type='password'
					extra='mb-6'
					{...register('password', { required: 'Не валидный password' })}
				/>
				<div className='flex items-center gap-5 justify-center'>
					<Button onClick={() => setIsLoginForm(true)}>Login</Button>
					<Button onClick={() => setIsLoginForm(false)}>Register</Button>
				</div>
			</form>
		</div>
	)
}
