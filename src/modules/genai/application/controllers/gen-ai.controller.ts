import { safeApiCall } from '@/common/functions'
import { AppRequest, AppResponse } from '@/common/types'
import { searchInDocumentsUseCase, translateUseCase } from '@/di'
import { ChatMemory } from '@/modules/core'

export class GenAIController {
	async translateText(
		req: AppRequest<any, any, { text: string; language: string }>,
		res: AppResponse,
	) {
		const { text, language } = req.body
		return safeApiCall(() => translateUseCase.invoke({ text, language }), res)
	}

	async searchInDocuments(
		req: AppRequest<any, any, { query: string }>,
		res: AppResponse,
	) {
		const { query } = req.body

		return safeApiCall(
			() =>
				searchInDocumentsUseCase.invoke({
					query: query,
					userId: req.user!.id,
				}),
			res,
		)
	}

	async getChatHistory(req: AppRequest, res: AppResponse) {
		const chatMemory = new ChatMemory(req.user!.id)
		return await safeApiCall(() => chatMemory.retrieveMemoryHistory(), res)
	}
}
