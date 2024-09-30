import {
  ChatMemory,
  DocumentsService,
  LLMService,
} from '@/modules/genai/adapters'

import {
  SearchInDocumentUseCase,
  TranslateTextUseCase,
} from '@/modules/genai/core'

const chatMemory = new ChatMemory()
const llmService = new LLMService()
const documentService = new DocumentsService(llmService)

const searchInDocumentUseCase = new SearchInDocumentUseCase(
	chatMemory,
	llmService,
	documentService,
)

const translateUseCase = new TranslateTextUseCase()

export {
  chatMemory,
  documentService,
  llmService,
  searchInDocumentUseCase,
  translateUseCase
}
