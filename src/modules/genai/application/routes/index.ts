import express from 'express'

import {
	isAuthenticated,
	translateTextSchema,
	validateRequestBody,
} from '@/common/middlewares'

import { genAIController } from '@/di'

const router = express.Router()

/**
 * @swagger
 * /genai/translate:
 *   post:
 *     summary: "Translate a given text to the provided language, the AI agent will identify the origin language"
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Olá!"
 *               language:
 *                 type: string
 *                 example: "English"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: "Hello!"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["text field should not be empty"]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
 */
router.post(
	'/translate',
	isAuthenticated,
	validateRequestBody(translateTextSchema),
	genAIController.translateText,
)

/**
 * @swagger
 * /genai/search-in-documents:
 *   post:
 *     summary: Performs a search in stored documents and returns a text as a response
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 example: What is the purpose of the developed projects on these documents?
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: The project aims to develop and validate a web platform (software) for automatically correcting assessments created in Microsoft Word.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
 */
router.post(
	'/search-in-documents',
	isAuthenticated,
	genAIController.searchInDocuments,
)

/**
 * @swagger
 * /genai/chat-history:
 *   get:
 *     tags:
 *       - AI
 *     summary: Returns all messages between human and AI from chat history
 *     responses:
 *       200:
 *         description: Successfully retrieved chat history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lc:
 *                         type: integer
 *                         example: 1
 *                       type:
 *                         type: string
 *                         example: constructor
 *                       id:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["langchain_core", "messages", "HumanMessage"]
 *                       kwargs:
 *                         type: object
 *                         properties:
 *                           content:
 *                             type: string
 *                             example: What is the purpose of the developed projects on these documents?
 *                           additional_kwargs:
 *                             type: object
 *                             example: {}
 *                           response_metadata:
 *                             type: object
 *                             example: {}
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
 */
router.get('/chat-history', isAuthenticated, genAIController.getChatHistory)

export default router
