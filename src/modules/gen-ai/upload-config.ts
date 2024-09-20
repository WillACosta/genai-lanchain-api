import crypto from 'crypto'
import multer from 'multer'
import path from 'path'

const storageConfig = multer.diskStorage({
	destination: (req, file, callBack) => {
		callBack(null, 'uploads/')
	},
	filename: (req, file, callBack) => {
		const fileExt = path.extname(file.originalname)
		const fileName = `user-document-${crypto.randomUUID()}${fileExt}`
		callBack(null, fileName)
	},
})

export const upload = multer({ storage: storageConfig }).single('document')
