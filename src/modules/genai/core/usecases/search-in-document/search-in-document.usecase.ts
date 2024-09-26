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
import {
	CONTEXTUALIZED_SYSTEM_PROMPT,
	SEARCH_DOC_SYSTEM_PROMPT,
} from '../../utils'
import { Params, Result } from './types'

export class SearchInDocumentUseCase implements UseCase<Result, Params> {
	async invoke({ filePath, query }: Params): Promise<Result> {
		const docs = await this._loadDocument(filePath)
		const vectorStore = await this._initializeVectorStoreWithDocuments(docs)
		const retriever = vectorStore.asRetriever()
		const llmModel = new ChatGoogleGenerativeAI({
			model: 'gemini-1.5-flash',
			apiKey: process.env['GOOGLE_GENAI_API_KEY'],
		})

		/// context chain init

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

		const contextualizedQuestion = (input: Record<string, any>) => {
			if ('chat_history' in input) {
				return contextualizedQuestionChain
			}

			return input['question']
		}

		/// context end

		const qaPrompt = ChatPromptTemplate.fromMessages([
			['system', SEARCH_DOC_SYSTEM_PROMPT],
			new MessagesPlaceholder('chat_history'),
			['human', '{question}'],
		])

		// if exists a history, so we need to append the history prompt
		// to the chain
		const retrievalChain = RunnableSequence.from([
			RunnablePassthrough.assign({
				context: (input) => {
					if ('chat_history' in input) {
						const chain = contextualizedQuestion(input)
						return chain.pipe(retriever).pipe(this._convertDocsToString)
					}

					return ''
				},
			}),
			qaPrompt,
			llmModel,
			new StringOutputParser(),
		])

		const result = await retrievalChain.invoke({
			question: query,
			chat_history: [], // We need to store AI messages to the history every time = result
		})

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
