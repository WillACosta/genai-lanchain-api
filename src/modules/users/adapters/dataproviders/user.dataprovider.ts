import { prismaClient } from '@/di'
import { Prisma } from '@prisma/client'
import { UserParams } from '../../core'

export type PrismaUser = Prisma.PromiseReturnType<
	typeof UserDataProvider.prototype.getUserById
>

export class UserDataProvider {
	private _selectUserProperties = {
		id: true,
		name: true,
		email: true,
		createdAt: true,
	}

	insert = async ({ name, email, password }: UserParams) => {
		return await prismaClient.users.create({
			data: {
				name,
				email,
				password,
			},
			select: this._selectUserProperties,
		})
	}

	update = async (
		id: string,
		{ name, email }: { name: string; email: string },
	) => {
		return await prismaClient.users.update({
			where: {
				id,
			},
			data: {
				name,
				email,
			},
			select: this._selectUserProperties,
		})
	}

	delete = async (id: string) => {
		return await prismaClient.users.delete({
			where: {
				id,
			},
			select: this._selectUserProperties,
		})
	}

	getAllUsers = async () => {
		return await prismaClient.users.findMany({
			select: this._selectUserProperties,
		})
	}

	getUserById = async (id: string) => {
		return await prismaClient.users.findUnique({
			where: {
				id,
			},
			select: this._selectUserProperties,
		})
	}

	findUserByEmail = async (email: string) => {
		return await prismaClient.users.findUnique({
			where: {
				email,
			},
		})
	}
}
