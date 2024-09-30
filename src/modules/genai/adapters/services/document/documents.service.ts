import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { LLMService } from '../llm/llm.service'

export class DocumentsService {
	constructor(private _llmService: LLMService) {}

	convertDocsToString(documents: Document[]) {
		return documents
			.map((document) => `<doc>\n${document.pageContent}\n</doc>`)
			.join('\n')
	}

	async initializeVectorStore(docs: Document<Record<string, any>>[]) {
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1536,
			chunkOverlap: 128,
		})

		const splitDocs = await splitter.splitDocuments(docs)
		const vectorstore = await MemoryVectorStore.fromDocuments(
			splitDocs,
			this._llmService.textEmbedding,
		)

		const retriever = vectorstore.asRetriever()
		return { vectorstore, retriever }
	}

	async loadDocument(filePath: string) {
		const systemPath = process.cwd()
		const loader = new PDFLoader(`${systemPath}${filePath}`, {
			parsedItemSeparator: '',
		})

		return await loader.load()
	}
}
