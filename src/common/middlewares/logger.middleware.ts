import { logger } from '@/config'
import { NextFunction, Request, Response } from 'express'

export function appLogger(req: Request, res: Response, next: NextFunction) {
	const requestStartTime = Date.now()
	const originalSend = res.send

	let isSent = false

	res.send = function (body: any): Response {
		if (!isSent) {
			if (res.statusCode < 400) {
				logger.info(
					'Success Response',
					formatHTTPLoggerResponse(req, res, body, requestStartTime),
				)
			}

			logger.error(
				body.message,
				formatHTTPLoggerResponse(req, res, body, requestStartTime),
			)

			isSent = true
		}

		return originalSend.call(this, body)
	}

	next()
}

function formatHTTPLoggerResponse(
	req: Request,
	res: Response,
	body: any,
	requestStartTime?: number,
) {
	let requestDuration = '.'

	if (requestStartTime) {
		const endTime = Date.now() - requestStartTime
		requestDuration = `${endTime / 1000}s`
	}

	return {
		request: {
			headers: req.headers,
			host: req.headers.host,
			baseUrl: req.baseUrl,
			url: req.url,
			method: req.method,
			body: req.body,
			params: req?.params,
			query: req?.query,
			clientIp: req?.headers['forwarded'] ?? req?.socket.remoteAddress,
		},
		response: {
			headers: res.getHeaders(),
			statusCode: res.statusCode,
			requestDuration,
			body,
		},
	}
}
