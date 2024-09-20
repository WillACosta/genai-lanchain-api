import express from 'express'
import { GenAIController } from '../controllers/gen-ai.controller'

const controller = new GenAIController()
const router = express.Router()

router.post('/translate', controller.translateText)
router.post('/searchInDocument', controller.searchInDocument)

export default router
