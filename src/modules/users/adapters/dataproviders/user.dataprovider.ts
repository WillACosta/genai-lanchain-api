import { prismaClient } from '@/di'
import { User } from '../../core'

export class UserDataProvider {
	async insert({ name, email, password }: User) {
		return await prismaClient.users.create({
			data: {
				name,
				email,
				password,
			},
		})
	}

	async update({ id, name, email, password }: User) {
		return await prismaClient.users.update({
			where: {
				id,
			},
			data: {
				name,
				email,
				password,
			},
		})
	}

	async delete(id: string) {
		return await prismaClient.users.delete({
			where: {
				id,
			},
		})
	}

	async getAllUsers() {
		return await prismaClient.users.findMany()
	}

	async getUserById(id: string) {
		return await prismaClient.users.findUnique({
			where: {
				id,
			},
		})
	}

	async findUserByEmail(email: string) {
		return await prismaClient.users.findUnique({
			where: {
				email,
			},
		})
	}
}
