import express from 'express'

import { genAIController } from '@/di'

const router = express.Router()

router.post('/translate', genAIController.translateText)
router.post('/search-in-document', genAIController.searchInDocument)

export default router
