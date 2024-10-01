import express from 'express'

import { isAuthenticated } from '@/common/middlewares'

const router = express.Router()

export default router.get('/', isAuthenticated, (_, res) => {
	res.status(200).send({ message: 'Systems up and running!' })
})
