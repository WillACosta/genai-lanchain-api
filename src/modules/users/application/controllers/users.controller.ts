import { Request, Response } from 'express'

import { UserDataProvider } from '../../adapters/dataproviders/user.dataprovider'

export class UsersController {
	constructor(private _userProvider: UserDataProvider) {}

	async getUser(req: Request, res: Response) {}
	async getAllUsers() {}
	async updateUser() {}
	async deleteUser() {}
}
