import { AppResponse } from '../types'

type ApiHandler<T> = () => Promise<T>

export async function safeApiCall<T>(
	handler: ApiHandler<T>,
	res: AppResponse<T>,
): Promise<AppResponse<T>> {
	try {
		const data = await handler()
		return res.status(200).json({
			success: true,
			data,
		})
	} catch (err: any) {
		return res.status(500).json({
			success: false,
			error: err,
		})
	}
}
