import { PrismaClient } from '@prisma/client'

import { DocumentsService, LLMService } from '@/modules/genai/adapters'

import {
  SearchInDocumentUseCase,
  TranslateTextUseCase,
} from '@/modules/genai/core'

import { AuthController } from '@/modules/auth/application/controllers/auth.controller'
import { GenAIController } from '@/modules/genai/application/controllers/gen-ai.controller'
import { ResourcesController } from '@/modules/resources/application/controllers/resources.controller'
import { UserDataProvider } from '@/modules/users/adapters/dataproviders/user.dataprovider'
import { UsersController } from '@/modules/users/application/controllers/users.controller'

// Common
const llmService = new LLMService()
const prismaClient = new PrismaClient()

// Gen AI Module
const genAIController = new GenAIController()
const documentService = new DocumentsService(llmService)
const searchInDocumentUseCase = new SearchInDocumentUseCase(
	llmService,
	documentService,
)

const translateUseCase = new TranslateTextUseCase(llmService)

// User Module
const userDatProvider = new UserDataProvider()
const usersController = new UsersController(userDatProvider)

// Auth Module
const authController = new AuthController(userDatProvider)

// Resources Module
const resourcesController = new ResourcesController()

export {
	authController,
	documentService,
	genAIController,
	llmService,
	prismaClient,
	resourcesController,
	searchInDocumentUseCase,
	translateUseCase,
	userDatProvider,
	usersController,
}
