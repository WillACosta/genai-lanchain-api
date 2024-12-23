import { RedisChatMessageHistory } from '@langchain/redis'
import { BufferMemory } from 'langchain/memory'

export class ChatMemory {
	constructor(private userId: string) {
		this._memory = new BufferMemory({
			chatHistory: new RedisChatMessageHistory({
				sessionId: userId,
				sessionTTL: 3600,
				config: {
					url: process.env['REDIS_URL'],
					password: process.env['REDIS_PASSWORD'],
				},
			}),
			returnMessages: true,
			memoryKey: 'chat_history',
		})
	}

	private _memory: BufferMemory

	get memoryObject() {
		return this._memory
	}

	async retrieveMemoryHistory(): Promise<Record<string, any>[]> {
		const memoryResults = await this._memory.loadMemoryVariables({})
		return memoryResults['chat_history']
	}

	saveChatHistory(input: string, output: string): Promise<void> {
		return this._memory.saveContext({ input }, { output })
	}
}
