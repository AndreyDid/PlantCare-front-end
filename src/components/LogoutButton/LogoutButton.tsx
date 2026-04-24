'use client'

import { useMutation } from '@tanstack/react-query'
import cn from 'clsx'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '../ui/buttons/Button'

import { authService } from '@/src/services/auth.service'

interface LogoutButtonProps {
	className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
	const router = useRouter()

	const { mutate, isPending } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess: () => router.push('/auth')
	})

	return (
		<Button
			type='button'
			disabled={isPending}
			className={cn(
				'flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/15  text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70',
				className
			)}
			onClick={() => mutate()}
		>
			<LogOut size={18} />
			{isPending ? 'Выходим...' : 'Выйти'}
		</Button>
	)
}
