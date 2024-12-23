import { UseCase } from '@/common/types'

import {
	DocumentsService,
	UploadedDocumentsList,
	VectorDataBaseProvider,
} from '@/modules/core'

export class StoreDocumentsUseCase
	implements UseCase<void, UploadedDocumentsList>
{
	constructor(
		private _documentsService: DocumentsService,
		private _vectorDB: VectorDataBaseProvider,
	) {}

	async invoke({ docs }: UploadedDocumentsList): Promise<void> {
		const documents = await this._documentsService.loadMultipleDocuments(
			docs.map((d) => d.path),
		)

		const splittedDocs = await this._documentsService.splitDocuments(documents)
		await this._vectorDB.storeDocuments(splittedDocs)
	}
}
