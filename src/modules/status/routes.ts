import express from 'express'
const router = express.Router()

export default router.get('/', (_, res) => {
	res.status(200).send()
})
