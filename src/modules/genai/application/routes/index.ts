import express from 'express'

import { isAuthenticated } from '@/common/middlewares'
import { genAIController } from '@/di'

const router = express.Router()

router.post('/translate', isAuthenticated, genAIController.translateText)

router.post(
	'/search-in-document',
	isAuthenticated,
	genAIController.searchInDocument,
)

export default router
