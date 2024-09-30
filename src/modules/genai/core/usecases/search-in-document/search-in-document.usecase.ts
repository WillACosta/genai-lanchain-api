import { StringOutputParser } from '@langchain/core/output_parsers'

import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from '@langchain/core/prompts'

import {
	RunnablePassthrough,
	RunnableSequence,
} from '@langchain/core/runnables'

import {
	CONTEXTUALIZED_SYSTEM_PROMPT,
	SEARCH_DOC_SYSTEM_PROMPT,
} from '../../utils'

import { UseCase } from '@/common/types'
import { Params, Result } from './types'

import {
	ChatMemory,
	DocumentsService,
	LLMService,
} from '@/modules/genai/adapters'

export class SearchInDocumentUseCase implements UseCase<Result, Params> {
	constructor(
		private _memory: ChatMemory,
		private _llmService: LLMService,
		private _documentService: DocumentsService,
	) {}

	async invoke({ filePath, query }: Params): Promise<Result> {
		const llmModel = this._llmService.llm
		const docs = await this._documentService.loadDocument(filePath)
		const { retriever } = await this._documentService.initializeVectorStore(
			docs,
		)

		const contextualizedPrompt = ChatPromptTemplate.fromMessages([
			['system', CONTEXTUALIZED_SYSTEM_PROMPT],
			new MessagesPlaceholder('chat_history'),
			['human', '{question}'],
		])

		const contextualizedQuestionChain = RunnableSequence.from([
			contextualizedPrompt,
			llmModel,
			new StringOutputParser(),
		])

		const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
			['system', SEARCH_DOC_SYSTEM_PROMPT],
			new MessagesPlaceholder('chat_history'),
			['human', '{question}'],
		])

		const retrievalChain = RunnableSequence.from([
			RunnablePassthrough.assign({
				context: (input: Record<string, any>) => {
					if ('chat_history' in input) {
						return RunnableSequence.from([
							contextualizedQuestionChain,
							retriever,
							this._documentService.convertDocsToString,
						])
					}

					return ''
				},
			}),
			questionAnsweringPrompt,
			llmModel,
			new StringOutputParser(),
		])

		const history = await this._memory.retrieveMemoryHistory()
		const result = await retrievalChain.invoke({
			question: query,
			chat_history: history,
		})

		this._memory.saveChatHistory(query, result)
		return { result }
	}
}
