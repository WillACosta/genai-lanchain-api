import {
	ChatGoogleGenerativeAI,
	GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai'

export class LLMService {
	constructor() {}

	static get llm() {
		return new ChatGoogleGenerativeAI({
			model: 'gemini-1.5-flash',
			apiKey: process.env['LLM_API_KEY'],
		})
	}

	static get textEmbedding() {
		return new GoogleGenerativeAIEmbeddings({
			model: 'text-embedding-004',
			apiKey: process.env['LLM_API_KEY'],
		})
	}
}
