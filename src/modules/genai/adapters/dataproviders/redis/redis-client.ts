import { createClient } from 'redis'

export class RedisClient {
	constructor() {}

	_redisClient = createClient({
		url: process.env['REDIS_ENDPOINT_URI'],
		username: process.env['REDIS_USER'],
		password: process.env['REDIS_PASSWORD'],
	})
}
