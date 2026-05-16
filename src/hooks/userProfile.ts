import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { userService } from '../services/user.service'
import type { TypeUserForm } from '../types/auth.types'

export function useUserProfile() {
	return useQuery({
		queryKey: ['userProfile'],
		queryFn: () => userService.getProfile()
	})
}

export function useUpdateUserProfile() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: TypeUserForm) => userService.update(data),
		onSuccess: data => {
			queryClient.setQueryData(['userProfile'], data)
		}
	})
}
