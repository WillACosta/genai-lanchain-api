import express from 'express'

import {
  userCredentialsSchema,
  userSchema,
  validateRequestBody,
} from '@/common/middlewares'

import { authController } from '@/di'

const router = express.Router()

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user and returns an access token that will expire in one hour
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               name:
 *                 type: string
 *                 example: User
 *               password:
 *                 type: string
 *                 example: password
 *             required:
 *              - email
 *              - password
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 367b2539-bef4-412b-b94d-c9d2178dcdaa
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-09-30T21:04:18.656Z
 *                         email:
 *                           type: string
 *                           example: user@email.com
 *                         name:
 *                           type: string
 *                           example: User
 *                     token:
 *                       type: string
 *                       example: ey...
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Invalid email address"]
 */
router.post('/signup', validateRequestBody(userSchema), authController.register)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user and returns an access token that will expire in one hour
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 367b2539-bef4-412b-b94d-c9d2178dcdaa
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-09-30T21:04:18.656Z
 *                         email:
 *                           type: string
 *                           example: user@email.com
 *                         name:
 *                           type: string
 *                           example: User
 *                     token:
 *                       type: string
 *                       example: ey...
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: ["Invalid email address"]
 */
router.post(
	'/login',
	validateRequestBody(userCredentialsSchema),
	authController.sign,
)

export default router
