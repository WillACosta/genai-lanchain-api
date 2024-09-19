const { ChatGoogleGenerativeAI } = require('@langchain/google-genai')
const { StringOutputParser } = require('@langchain/core/output_parsers')
const { ChatPromptTemplate } = require('@langchain/core/prompts')

const fs = require('fs')
const path = require('path')
const process = require('process')

module.exports = {
	async translateText(req, res) {
		const { text, language } = req.body

		if (language === undefined || text === undefined) {
			return res.status(400).send({
				message: 'Invalid request, set language and text in the request body!',
			})
		}

		const API_KEY = process.env.GEMINI_API_KEY
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

	async searchInDocument(req, res) {
		let body = ''
		let totalBytes = parseInt(req.headers['content-length'], 10)
		let receivedBytes = 0
		const generatedFileName = `user-file-${crypto.randomUUID()}.pdf`

		res.setHeader('Content-Type', 'text/event-stream')
		res.setHeader('Cache-Control', 'no-cache')
		res.setHeader('Connection', 'keep-alive')

		req.on('data', (chunk) => {
			body += chunk.toString()
			receivedBytes += chunk.length

			const percentComplete = ((receivedBytes / totalBytes) * 100).toFixed(2)
			res.write(`data: ${percentComplete}\n\n`)
		})

		req.on('end', () => {
			const boundary = req.headers['content-type'].split('boundary=')[1]
			const parts = body.split(`--${boundary}`)

			const formData = {}
			let fileBuffer = null

			parts.forEach((part) => {
				if (part.includes('Content-Disposition')) {
					const nameMatch = part.match(/name="([^"]+)"/)
					const fileNameMatch = part.match(/filename="([^"]+)"/)
					const valueMatch = part.split('\r\n\r\n')[1]

					if (nameMatch && valueMatch) {
						const name = nameMatch[1]

						if (fileNameMatch) {
							const fileContent = valueMatch.split('\r\n')[0]
							fileBuffer = Buffer.from(fileContent, 'binary')
						} else {
							const value = valueMatch.trim()
							formData[name] = value
						}
					}
				}
			})

			if (fileBuffer) {
				const currentDir = process.cwd()
				const filePath = path.join(currentDir, 'uploads', generatedFileName)
				console.log('Final Buffer size: ', fileBuffer.length)

				fs.writeFileSync(filePath, fileBuffer, 'binary')
			}

			const query = formData['query']

			res.write(`data: 100\n\n`)
			res.write(
				`data: {"message": "File and query received successfully!", "data": {"query": "${query}", "filePath": "/uploads/${generatedFileName}"}}\n\n`,
			)

			res.end()
		})
	},
}
