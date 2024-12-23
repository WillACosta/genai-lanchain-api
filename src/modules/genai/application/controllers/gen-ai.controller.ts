import { AppRequest, AppResponse } from '@/common/types';
import { searchInDocumentsUseCase, translateUseCase } from '@/di'
import { ChatMemory } from '@/modules/core'

export class GenAIController {
	async translateText(
		req: AppRequest<any, any, { text: string; language: string }>,
		res: AppResponse,
	) {
		const { text, language } = req.body
		const result = await translateUseCase.invoke({ text, language })
		return res.send({ success: true, data: result })
	}

	async searchInDocuments(
		req: AppRequest<any, any, { query: string }>,
		res: AppResponse,
	) {
		const { query } = req.body
		const { result } = await searchInDocumentsUseCase.invoke({
			query: query,
			userId: req.user!.id,
		})

		return res.send({ success: true, data: result })
	}

	async getChatHistory(req: AppRequest, res: AppResponse) {
		const chatMemory = new ChatMemory(req.user!.id)
		const history = await chatMemory.retrieveMemoryHistory()

		return res.send({
			success: true,
			data: history,
		})
	}
}
