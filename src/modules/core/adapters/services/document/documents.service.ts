import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { LLMService } from '../llm/llm.service'

export class DocumentsService {
	private _textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1536,
		chunkOverlap: 128,
	})

	convertDocsToString(documents: Document[]) {
		return documents
			.map((document) => `<doc>\n${document.pageContent}\n</doc>`)
			.join('\n')
	}

	async initializeVectorStore(docs: Document<Record<string, any>>[]) {
		const splitDocs = await this.splitDocuments(docs)
		const vectorstore = await MemoryVectorStore.fromDocuments(
			splitDocs,
			LLMService.textEmbedding,
		)

		const retriever = vectorstore.asRetriever()
		return { vectorstore, retriever }
	}

	async loadDocument(filePath: string): Promise<Document[]> {
		const systemPath = process.cwd()
		const loader = new PDFLoader(`${systemPath}${filePath}`, {
			parsedItemSeparator: '',
		})

		return await loader.load()
	}

	async loadMultipleDocuments(filePaths: string[]): Promise<Document[]> {
		const systemPath = process.cwd()
		const pdfLoaders = filePaths.map((file) => {
			return new PDFLoader(`${systemPath}/${file}`, {
				parsedItemSeparator: '',
			})
		})

		const documents: Document[][] = await Promise.all(
			pdfLoaders.map((loader: PDFLoader) => loader.load()),
		)

		return documents.flat()
	}

	async splitDocuments(docs: Document[]) {
		return await this._textSplitter.splitDocuments(docs)
	}
}
