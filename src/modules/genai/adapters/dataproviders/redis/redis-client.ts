import { createClient } from 'redis'

export class RedisClient {
	constructor() {}

	_redisClient = createClient({
		url: process.env['REDIS_ENDPOINT_URI'],
		username: process.env['REDIS_USER'],
		password: process.env['REDIS_PASSWORD'],
	})

	async initClient(): Promise<void> {
		this._redisClient
			.on('connect', () => console.log('Redis client connected'))
			.on('error', (err) => console.log('Redis Client Error', err))

		await this._redisClient.connect()
	}

	async closeClient(): Promise<void> {
		await this._redisClient.quit()
	}

	async storeValue(key: string, value: object, ttl?: number): Promise<void> {
		await this._redisClient.set(key, JSON.stringify(value), {
			EX: ttl,
			NX: true,
		})
	}

	getValueByKey(key: string): Promise<string | null> {
		return this._redisClient.get(key)
	}
}
