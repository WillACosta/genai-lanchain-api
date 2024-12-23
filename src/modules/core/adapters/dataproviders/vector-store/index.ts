import { VectorStoreRetriever } from '@langchain/core/vectorstores'
import { QdrantVectorStore } from '@langchain/qdrant'
import { QdrantClient } from '@qdrant/js-client-rest'
import { Document } from 'langchain/document'

import { LLMService } from '../../services/llm/llm.service'

export class VectorDataBaseProvider {
	private _vectorStore: QdrantVectorStore

	constructor() {
		const qdrantClient = new QdrantClient({
			url: process.env['QDRANT_URL'],
		})

		this._vectorStore = new QdrantVectorStore(LLMService.textEmbedding, {
			client: qdrantClient,
			collectionName: process.env['QDRANT_COLLECTION'],
		})
	}

	get asRetriever(): VectorStoreRetriever<QdrantVectorStore> {
		return this._vectorStore.asRetriever()
	}

	storeDocuments(documents: Document[]): Promise<void> {
		return this._vectorStore.addDocuments(documents)
	}
}
