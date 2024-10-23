import express from 'express'

import {
  userCredentialsSchema,
  userSchema,
  validateRequestBody,
} from '@/common/middlewares'

import { authController } from '@/di'

const router = express.Router()

router.post('/signup', validateRequestBody(userSchema), authController.register)

router.post(
	'/login',
	validateRequestBody(userCredentialsSchema),
	authController.sign,
)

export default router
