import { AppRequest, AppResponse } from '@/common/types'

import {
	PrismaUser,
	UserDataProvider,
} from '../../adapters/dataproviders/user.dataprovider'

import { safeApiCall } from '@/common/functions'

export class UsersController {
	constructor(private _userProvider: UserDataProvider) {}

	getUser = async (req: AppRequest, res: AppResponse<PrismaUser>) => {
		return await safeApiCall(
			() => this._userProvider.getUserById(req.user?.id!),
			res,
		)
	}

	getAllUsers = async (_req: AppRequest, res: AppResponse<PrismaUser[]>) => {
		return await safeApiCall(() => this._userProvider.getAllUsers(), res)
	}

	updateUser = async (
		req: AppRequest<{ id: string }>,
		res: AppResponse<PrismaUser>,
	) => {
		const { id } = req.params
		const { name, email } = req.body

		return await safeApiCall(
			() =>
				this._userProvider.update(id, {
					name,
					email,
				}),
			res,
		)
	}

	deleteUser = async (req: AppRequest, res: AppResponse) => {
		const { id } = req.params
		return await safeApiCall(() => this._userProvider.delete(id), res)
	}
}
