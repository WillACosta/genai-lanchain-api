import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { Document } from '@langchain/core/documents'
import { StringOutputParser } from '@langchain/core/output_parsers'

import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from '@langchain/core/prompts'

import {
	RunnablePassthrough,
	RunnableSequence,
} from '@langchain/core/runnables'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

import {
	ChatGoogleGenerativeAI,
	GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai'

import { UseCase } from '@/common/types'
import { RedisChatMessageHistory } from '@langchain/redis'
import { BufferMemory } from 'langchain/memory'

import {
	CONTEXTUALIZED_SYSTEM_PROMPT,
	SEARCH_DOC_SYSTEM_PROMPT,
} from '../../utils'

import { Params, Result } from './types'

/// TODO: delegate to RedisClient class
const chatMemory = new BufferMemory({
	chatHistory: new RedisChatMessageHistory({
		sessionId: 'a168c61a-c431-4ef8-bc1c-fedd808d45ea',
		sessionTTL: 3600, // 300 = 5m, 3600 = 1h, null = never
		config: {
			url: process.env['REDIS_URL'],
			password: process.env['REDIS_PASSWORD'],
		},
	}),
	returnMessages: true,
	memoryKey: 'chat_history',
})

export class SearchInDocumentUseCase implements UseCase<Result, Params> {
	async invoke({ filePath, query }: Params): Promise<Result> {
		const docs = await this._loadDocument(filePath)
		const vectorStore = await this._initializeVectorStoreWithDocuments(docs)
		const retriever = vectorStore.asRetriever()
		const llmModel = new ChatGoogleGenerativeAI({
			model: 'gemini-1.5-flash',
			apiKey: process.env['GOOGLE_GENAI_API_KEY'],
		})

		/// Standalone question referencing past context

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

		/// Standalone question end

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
							this._convertDocsToString,
						])
					}

					return ''
				},
			}),
			questionAnsweringPrompt,
			llmModel,
			new StringOutputParser(),
		])

		const memoryResults = await chatMemory.loadMemoryVariables({})
		const history = memoryResults['chat_history']
		const result = await retrievalChain.invoke({
			question: query,
			chat_history: history,
		})

		await chatMemory.saveContext({ input: query }, { output: result })
		return { result }
	}

	private async _loadDocument(filePath: string) {
		const systemPath = process.cwd()
		const loader = new PDFLoader(`${systemPath}${filePath}`, {
			parsedItemSeparator: '',
		})

		return await loader.load()
	}

	// TODO: improve it and delegate vector store to another layer
	private async _initializeVectorStoreWithDocuments(
		docs: Document<Record<string, any>>[],
	) {
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1536,
			chunkOverlap: 128,
		})

		const splitDocs = await splitter.splitDocuments(docs)
		const vectorstore = await MemoryVectorStore.fromDocuments(
			splitDocs,
			new GoogleGenerativeAIEmbeddings({
				apiKey: process.env['GOOGLE_GENAI_API_KEY'],
				model: 'text-embedding-004',
			}),
		)

		return vectorstore
	}

	private _convertDocsToString(documents: Document[]) {
		return documents
			.map((document) => `<doc>\n${document.pageContent}\n</doc>`)
			.join('\n')
	}
}
