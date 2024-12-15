import { randomBytes } from 'crypto'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const { combine, timestamp, json, printf } = winston.format

export const appConfig = {
	port: 3000,
	roles: {
		USER: 'user',
		ADMIN: 'admin',
	},
}

export const logger = winston.createLogger({
	format: combine(
		timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
		json(),
		printf(({ timestamp, level, message, ...data }) => {
			const response = {
				logId: randomBytes(16).toString('hex'),
				level,
				message,
				data,
			}

			return JSON.stringify(response, null, 8)
		}),
	),
	transports: [
		new DailyRotateFile({
			filename: 'logs/rotating-logs-%DATE%.log',
			datePattern: 'MMMM-DD-YYYY',
			zippedArchive: false,
			maxSize: '20m',
			maxFiles: '14d',
		}),
	],
})
