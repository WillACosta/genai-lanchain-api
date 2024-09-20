import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { Document } from '@langchain/core/documents'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'

import {
	ChatGoogleGenerativeAI,
	GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai'

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

import { StringOutputParser } from '@langchain/core/output_parsers'

import { UseCase } from '@/common/types'
import { SEARCH_DOC_SYSTEM_PROMPT } from '../../utils'
import { Params, Result } from './types'

export class SearchInDocumentUseCase implements UseCase<Result, Params> {
	async invoke({ filePath, query }: Params): Promise<Result> {
		const docs = await this._loadDocument(filePath)
		const vectorStore = await this._initializeVectorStoreWithDocuments(docs)

		const documentRetrievalChain = RunnableSequence.from([
			(input) => input.question,
			vectorStore.asRetriever(),
			this._convertDocsToString,
		])

		const promptTemplate = ChatPromptTemplate.fromTemplate(
			SEARCH_DOC_SYSTEM_PROMPT,
		)

		const llmModel = new ChatGoogleGenerativeAI({
			model: 'gemini-1.5-flash',
			apiKey: process.env['GOOGLE_GENAI_API_KEY'],
		})

		const retrievalChain = RunnableSequence.from([
			{
				context: documentRetrievalChain,
				question: (input) => input.question,
			},
			promptTemplate,
			llmModel,
			new StringOutputParser(),
		])

		const result = await retrievalChain.invoke({ question: query })

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

		const embeddings = new GoogleGenerativeAIEmbeddings({
			apiKey: process.env['GOOGLE_GENAI_API_KEY'],
			model: 'text-embedding-004',
		})

		const splitDocs = await splitter.splitDocuments(docs)
		const vectorstore = new MemoryVectorStore(embeddings)
		await vectorstore.addDocuments(splitDocs)

		return vectorstore
	}

	private _convertDocsToString(documents: Document[]) {
		return documents
			.map((document) => `<doc>\n${document.pageContent}\n</doc>`)
			.join('\n')
	}
}
