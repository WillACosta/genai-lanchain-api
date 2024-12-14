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
 *     security:
 *       - bearerAuth: []
 */
router.post(
	'/translate',
	isAuthenticated,
	validateRequestBody(translateTextSchema),
	genAIController.translateText,
)

/**
 * @swagger
 * /genai/search-in-document:
 *   post:
 *     summary: Performs a search in a PDF document and returns a text as a response for follow-up questions
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file to be uploaded and analyzed
 *               query:
 *                 type: string
 *                 example: What is this document about?
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
 *                   example: This document describes how to implement an API service using Node, Docker and Redis.
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
 *                   example: ["Please provide a valid file!"]
 *     security:
 *       - bearerAuth: []
 */
router.post(
	'/search-in-document',
	isAuthenticated,
	genAIController.searchInDocument,
)

export default router
