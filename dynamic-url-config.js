const fs = require('fs')
const dotenv = require('dotenv')

if (fs.existsSync('.env')) {
	dotenv.config()
}

const isDocker = process.env.IS_DOCKER === 'true'

const databaseUrl = isDocker
	? process.env.DATABASE_URL_DOCKER
	: process.env.DATABASE_URL

const redisUrl = isDocker ? process.env.REDIS_URL_DOCKER : process.env.REDIS_URL

if (databaseUrl) {
	process.env.DATABASE_URL = databaseUrl
	console.log(`Using DATABASE_URL: ${databaseUrl}`)
} else {
	console.error(
		'DATABASE_URL is not set. Please check your environment variables.',
	)

	process.exit(1)
}

if (redisUrl) {
	process.env.REDIS_URL = redisUrl
	console.log(`Using REDIS_URL: ${redisUrl}`)
} else {
	console.error(
		'REDIS_URL is not set. Please check your environment variables.',
	)

	process.exit(1)
}
