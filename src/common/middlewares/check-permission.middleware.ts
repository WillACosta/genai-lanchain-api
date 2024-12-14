import { NextFunction, Request, Response } from 'express'

import { userDatProvider } from '@/di'
import { UserRoles } from '@/modules/users/core'

export function hasPermission(role: UserRoles) {
	const userProvider = userDatProvider

	return (req: Request, res: Response, next: NextFunction) => {
		const { user } = req.body

		userProvider.getUserById(user.id).then((user) => {
			if (!user) {
				return res.status(403).json({
					success: false,
					error: {
						message: 'Invalid access token provided, please sign-in again.',
					},
				})
			}

			if (user?.role !== role) {
				return res.status(403).json({
					status: false,
					error: `You need to be a ${role} to access this functionality.`,
				})
			}

			return next()
		})
	}
}
