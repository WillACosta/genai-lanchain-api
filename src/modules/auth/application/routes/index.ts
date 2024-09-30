import express from 'express'

import { authController } from '@/di'

const router = express.Router()

router.post('/signup', authController.register)
router.post('/login', authController.sign)

export default router
