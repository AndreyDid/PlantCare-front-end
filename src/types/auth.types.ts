export interface AuthForm {
	email: string
	password: string
}

export type WindowDirection = 'north' | 'east' | 'south' | 'west'

export interface WindowPlacement {
	direction: WindowDirection
	label: string
}

export interface User {
	id: string
	name?: string | null
	email: string
	city?: string | null
	windowDirections?: string[]
	plants?: []
}

export interface AuthResponse {
	accessToken: string
	user: User
}

export type TypeUserForm = Pick<
	User,
	'email' | 'name' | 'city' | 'windowDirections'
> & { password?: string }
