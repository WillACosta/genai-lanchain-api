import { safeApiCall } from '@/common/functions'
import { AppRequest, AppResponse } from '@/common/types'
import { storeDocumentsUseCase } from '@/di'

import {
	handleMulterErrorMessages,
	UploadedDocument,
	uploadMultipleDocs,
} from '@/modules/core'

export class ResourcesController {
	async uploadDocs(
		req: AppRequest<any, any, { query: string }>,
		res: AppResponse,
	) {
		uploadMultipleDocs(req, res, async (err) => {
			if (err) handleMulterErrorMessages(err, res)

			if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
				return res.status(400).json({
					error: { message: 'Please provide at least one document!' },
				})
			}

			const files = req.files as Express.Multer.File[]
			const docs = files.map(
				(file) =>
					({
						originalName: file.originalname,
						fileName: file.filename,
						path: file.path,
						size: file.size,
					} as UploadedDocument),
			)

			return safeApiCall(() => storeDocumentsUseCase.invoke({ docs }), res)
		})
	}
}
