import { NextFunction, Response } from 'express'

import { userDatProvider } from '@/di'
import { UserRoles } from '@/modules/users/core'
import { AppRequest } from '../types'

export function hasPermission(role: UserRoles) {
	const userProvider = userDatProvider

	return (req: AppRequest, res: Response, next: NextFunction) => {
		const { id } = req!.user!

		userProvider.getUserById(id).then((user) => {
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
					success: false,
					error: {
						message: `You don't have the necessary permissions to access this resource.`,
					},
				})
			}

			return next()
		})
	}
}
