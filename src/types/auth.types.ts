export interface AuthForm {
	email: string
	password: string
}

export type WindowDirection = 'north' | 'east' | 'south' | 'west'

export interface User {
	id: string
	name?: string | null
	email: string
	city?: string | null
	windowDirections?: WindowDirection[]
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
