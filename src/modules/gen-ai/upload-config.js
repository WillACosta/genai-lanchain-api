const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

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

module.exports = {
	upload: multer({ storage: storageConfig }).single('document'),
}
