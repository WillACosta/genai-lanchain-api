import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

import { AppRequest } from '../types'

export function isAuthenticated(
	req: AppRequest,
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
				message: 'Invalid auth mechanism. This API supports only Bearer token.',
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
				error: 'Invalid access token provided, please sign-in again.',
			})
		}

		req.user = user
		return next()
	})
}
