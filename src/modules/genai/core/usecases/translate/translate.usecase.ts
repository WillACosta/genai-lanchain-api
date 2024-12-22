import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'

import { UseCase } from '@/common/types'
import { LLMService } from '@/modules/core'

type Params = {
	text: string
	language: string
}

export class TranslateTextUseCase implements UseCase<string, Params> {
	async invoke(params: { text: string; language: string }): Promise<string> {
		const { text, language } = params

		const systemTemplate = 'Translate the following text into {language}:'
		const promptTemplate = ChatPromptTemplate.fromMessages([
			['system', systemTemplate],
			['user', '{text}'],
		])

		const chain = promptTemplate
			.pipe(LLMService.llm)
			.pipe(new StringOutputParser())

		return await chain.invoke({
			language: language,
			text: text,
		})
	}
}
