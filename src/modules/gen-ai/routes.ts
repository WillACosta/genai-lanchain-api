import express from 'express'
import GenAIController from './GenAIController'

const router = express.Router()

router.post('/translate', GenAIController.translateText)
router.post('/searchInDocument', GenAIController.searchInDocument)

export default router
