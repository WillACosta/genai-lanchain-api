const { ChatGoogleGenerativeAI } = require('@langchain/google-genai')
const { StringOutputParser } = require('@langchain/core/output_parsers')
const { ChatPromptTemplate } = require('@langchain/core/prompts')

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
}
