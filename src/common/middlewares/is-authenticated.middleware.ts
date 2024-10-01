import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
	user?: object
	token?: string
}

export function isAuthenticated(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	const authHeader = req.headers['authorization']

	if (!authHeader) {
		return res.status(401).json({
			success: false,
			error: {
				message: 'Auth headers not provided in the request.',
			},
		})
	}

	if (!authHeader.startsWith('Bearer')) {
		return res.status(401).json({
			success: false,
			error: {
				message: 'Invalid auth mechanism.',
			},
		})
	}

	const token = authHeader.split(' ')[1]

	if (!token) {
		return res.status(401).json({
			success: false,
			error: {
				message: 'Bearer token missing in the authorization headers.',
			},
		})
	}

	return jwt.verify(token, process.env['JWT_SECRET']!, (err, user: any) => {
		if (err) {
			return res.status(403).json({
				success: false,
				error: 'Invalid access token provided, please login again.',
			})
		}

		req.user = user
		return next()
	})
}
