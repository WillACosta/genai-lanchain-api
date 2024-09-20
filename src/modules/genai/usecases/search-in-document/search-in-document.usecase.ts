import { UseCase } from '@src/common'

type Params = {
	query: string
	filePath: string
}

type Result = {}

export class SearchInDocumentUseCase implements UseCase<Result, Params> {
	invoke(params: Params): Promise<Result> {
		throw new Error('Method not implemented.')
	}
}
