import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { Request, Response } from 'express'

import { upload } from './upload-config'

export default {
	async translateText(req: Request, res: Response) {
		const { text, language } = req.body

		if (language === undefined || text === undefined) {
			return res.status(400).send({
				message: 'Invalid request, set language and text in the request body!',
			})
		}

		const API_KEY = process.env['GEMINI_API_KEY']
		const aiModel = new ChatGoogleGenerativeAI({
			model: 'gemini-1.5-flash',
			temperature: 0,
			apiKey: API_KEY,
		})

		const systemTemplate = 'Translate the following text into {language}:'
		const promptTemplate = ChatPromptTemplate.fromMessages([
			['system', systemTemplate],
			['user', '{text}'],
		])

		const chain = promptTemplate.pipe(aiModel).pipe(new StringOutputParser())
		const result = await chain.invoke({
			language: language,
			text: text,
		})

		return res.send(result)
	},

	async searchInDocument(req: Request, res: Response) {
		upload(req, res, (err) => {
			if (err) {
				return res
					.status(500)
					.json({ message: 'File upload failed!', error: err })
			}

			if (!req.file) {
				return res.status(400).json({ error: 'Please send file' })
			}

			const query = req.body.query
			const filePath = `/uploads/${req.file.filename}`

			res.json({
				message: 'File and query received successfully!',
				data: { query, filePath },
			})
		})
	},
}
