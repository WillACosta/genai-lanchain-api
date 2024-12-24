import { AppResponse } from '../types'

type ApiHandler<T> = () => Promise<T>

export async function safeApiCall<T>(
	handler: ApiHandler<T>,
	res: AppResponse<T>,
): Promise<AppResponse<T>> {
	try {
		const data = await handler()
		return res.send({ data })
	} catch (err: any) {
		if (err instanceof Error && err.message)
			return res.status(500).json({
				error: {
					message: err.message,
				},
			})

		return res.status(500).json({
			error: {
				message: 'Unexpected error!',
			},
		})
	}
}
