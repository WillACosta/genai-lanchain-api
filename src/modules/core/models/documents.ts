export type UploadedDocument = {
	originalName: string
	fileName: string
	path: string
	size: number
}

export type UploadedDocumentsList = {
	docs: UploadedDocument[]
}
