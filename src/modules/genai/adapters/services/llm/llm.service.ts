import {
	ChatGoogleGenerativeAI,
	GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai'

export class LLMService {
	constructor() {}

	get llm() {
		return new ChatGoogleGenerativeAI({
			model: 'gemini-1.5-flash',
			apiKey: process.env['GOOGLE_GENAI_API_KEY'],
		})
	}

	get textEmbedding() {
		return new GoogleGenerativeAIEmbeddings({
			model: 'text-embedding-004',
			apiKey: process.env['GOOGLE_GENAI_API_KEY'],
		})
	}
}
