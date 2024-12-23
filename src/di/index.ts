import { PrismaClient } from '@prisma/client'

import {
	GenAIController,
	SearchInDocumentUseCase,
	TranslateTextUseCase,
} from '@/modules/genai'

import { AuthController } from '@/modules/auth'
import { DocumentsService, VectorDataBaseProvider } from '@/modules/core'
import { ResourcesController, StoreDocumentsUseCase } from '@/modules/resources'
import { UserDataProvider, UsersController } from '@/modules/users'

// Common
const prismaClient = new PrismaClient()
const vectorDataBaseProvider = new VectorDataBaseProvider()

// Gen AI Module
const genAIController = new GenAIController()
const documentService = new DocumentsService()
const searchInDocumentsUseCase = new SearchInDocumentUseCase(
	documentService,
	vectorDataBaseProvider,
)

const translateUseCase = new TranslateTextUseCase()

// User Module
const userDatProvider = new UserDataProvider()
const usersController = new UsersController(userDatProvider)

// Auth Module
const authController = new AuthController(userDatProvider)

// Resources Module
const resourcesController = new ResourcesController()
const storeDocumentsUseCase = new StoreDocumentsUseCase(
	documentService,
	vectorDataBaseProvider,
)

export {
	authController,
	documentService,
	genAIController,
	prismaClient,
	resourcesController,
	searchInDocumentsUseCase,
	storeDocumentsUseCase,
	translateUseCase,
	userDatProvider,
	usersController,
	vectorDataBaseProvider,
}

