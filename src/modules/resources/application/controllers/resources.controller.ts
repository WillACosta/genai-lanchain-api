import { AppRequest, AppResponse } from '@/common/types'
import { handleMulterErrorMessages, uploadMultipleDocs } from '@/modules/core'

export class ResourcesController {
	async uploadDocs(
		req: AppRequest<any, any, { query: string }>,
		res: AppResponse,
	) {
		uploadMultipleDocs(req, res, async (err) => {
			if (err) handleMulterErrorMessages(err, res)

			if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
				return res.status(400).json({
					success: false,
					error: { message: 'Please provide at least one document!' },
				})
			}

			const files = req.files as Express.Multer.File[]
			const fileDetails = files.map((file) => ({
				originalName: file.originalname,
				fileName: file.filename,
				path: file.path,
				size: file.size,
			}))

			// TODO: Implement logic to process and store the uploaded files

			return res.status(201).json({
				success: true,
				data: {
					documents: fileDetails,
				},
			})
		})
	}
}
