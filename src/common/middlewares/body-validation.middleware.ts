import { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'

const userSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
	name: z.string().optional(),
})

const userCredentialsSchema = z.object({
	email: z.string().email('Invalid email address'),
})

const validateRequestBody = (schema: z.ZodSchema<any>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body)
			return next()
		} catch (error) {
			if (error instanceof ZodError) {
				return res
					.status(400)
					.json({ data: null, errors: error.errors.map((e) => e.message) })
			}

			return next(error)
		}
	}
}

export { userCredentialsSchema, userSchema, validateRequestBody }
