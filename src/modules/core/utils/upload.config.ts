import { Request, Response } from 'express'

import crypto from 'crypto'
import multer from 'multer'
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
	const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'))
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

export function handleMulterErrorMessages(err: any, res: Response): Response {
	if (err instanceof multer.MulterError) {
		switch (err.code) {
			case 'LIMIT_FILE_SIZE':
				return res.status(400).json({ error: 'File size exceeds the limit!' })
			case 'LIMIT_FILE_COUNT':
				return res.status(400).json({ error: 'Too many files uploaded!' })
			case 'LIMIT_UNEXPECTED_FILE':
				return res.status(400).json({ error: 'Unexpected file uploaded!' })
			default:
				return res
					.status(400)
					.json({ error: 'Unexpected error was occurred while uploading!' })
		}
	}

	return res.status(500).json({ error: 'An unknown error occurred!' })
}
