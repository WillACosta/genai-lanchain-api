import { AppRequest, AppResponse } from '@/common/types';
import { searchInDocumentUseCase, translateUseCase } from '@/di';
import { upload } from '../../core';

export class GenAIController {
	async translateText(
		req: AppRequest<any, any, { text: string; language: string }>,
		res: AppResponse,
	) {
		const { text, language } = req.body
		const result = await translateUseCase.invoke({ text, language })
		return res.send({ success: true, data: result })
	}

	async searchInDocument(
		req: AppRequest<any, any, { query: string }>,
		res: AppResponse,
	) {
		upload(req, res, async (err) => {
			if (err) {
				return res
					.status(500)
					.json({ success: false, error: { message: 'File upload failed!' } })
			}

			if (!req.file) {
				return res.status(400).json({
					success: false,
					error: { message: 'Please provide a valid file!' },
				})
			}

			const query = req.body.query
			const filePath = `/uploads/${req.file.filename}`

			const { result } = await searchInDocumentUseCase.invoke({
				query,
				filePath,
				userId: req.user!.id,
			})

			return res.json({
				success: true,
				data: result,
			})
		})
	}
}
