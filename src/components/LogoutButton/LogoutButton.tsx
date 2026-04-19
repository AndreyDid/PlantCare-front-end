'use client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { Button } from '../ui/buttons/Button'

import { authService } from '@/src/services/auth.service'

export function LogoutButton() {
	const router = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess: () => router.push('/auth')
	})
	return (
		<Button
			type='button'
			onClick={() => mutate()}
		>
			Выход
		</Button>
	)
}
