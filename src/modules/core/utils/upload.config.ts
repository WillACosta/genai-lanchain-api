import { Request, Response } from 'express'

import { AppResponse } from '@/common/types'
import crypto from 'crypto'
import multer, { MulterError } from 'multer'
import path from 'path'

const storageConfig = multer.diskStorage({
	destination: (_, __, callBack) => {
		callBack(null, 'uploads/')
	},
	filename: (_, file, callBack) => {
		const fileExt = path.extname(file.originalname)
		const fileName = `user-document-${crypto.randomUUID()}${fileExt}`
		callBack(null, fileName)
	},
})

const fileFilter = (
	_: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	const allowedTypes = ['application/pdf']
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(
			new Error('Invalid file type. Only PDF files are allowed.', {
				cause: 'FILE_NOT_ALLOWED',
			}),
		)
	}
}

export const uploadSingle = multer({
	storage: storageConfig,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 },
}).single('document')

export const uploadMultipleDocs = multer({
	storage: storageConfig,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 },
}).array('documents', 10)

export function handleMulterErrorMessages(
	err: any,
	res: AppResponse,
): Response {
	if (err instanceof MulterError) {
		switch (err.code) {
			case 'LIMIT_FILE_SIZE':
				return res.status(400).json({
					error: {
						message: 'File size exceeds the limit!',
					},
				})
			case 'LIMIT_FILE_COUNT':
				return res.status(400).json({
					error: {
						message: 'Too many files uploaded!',
					},
				})
			case 'LIMIT_UNEXPECTED_FILE':
				return res.status(400).json({
					error: {
						message: 'Unexpected file uploaded!',
					},
				})
			default:
				return res.status(400).json({
					error: {
						message: 'Unexpected error was occurred while uploading!',
					},
				})
		}
	}

	if (err instanceof Error && err.cause == 'FILE_NOT_ALLOWED') {
		return res.status(400).json({
			error: {
				message: err.message,
			},
		})
	}

	return res.status(500).json({
		error: {
			message: 'An unknown error occurred!',
		},
	})
}
