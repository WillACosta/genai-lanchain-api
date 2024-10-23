import { User } from '@/modules/users/core'
import { Request, Response } from 'express'

export interface AppRequest<
	P extends { [key: string]: string } = {
		[key: string]: string
	},
	T = any,
	R = any,
	S = any,
> extends Request<P, T, R, S> {
	user?: User
	token?: string
}

export type AppResponse<T = any> = Response<{
	success: boolean
	data?: T
	error?: { message: string | string[]; code?: string }
}>
