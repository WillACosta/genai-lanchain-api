import { NextFunction, Request } from 'express'
import { z, ZodError } from 'zod'
import { AppResponse } from '../types'

export const userSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
	name: z.string().optional(),
})

export const userCredentialsSchema = z.object({
	email: z.string().email('Invalid email address'),
})

export const translateTextSchema = z.object({
	text: z.string().min(1, 'text field is required'),
	language: z.string().min(1, 'language field is required'),
})

export const validateRequestBody = (schema: z.ZodSchema<any>) => {
	return (req: Request, res: AppResponse, next: NextFunction) => {
		try {
			schema.parse(req.body)
			return next()
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					success: false,
					error: { message: error.errors.map((e) => e.message) },
				})
			}

			return next(error)
		}
	}
}
