export type UserRoles = 'user' | 'admin'

export type User = {
	id: string
	email: string
	createdAt: Date
	password: string
	name?: string
	role?: UserRoles
}
