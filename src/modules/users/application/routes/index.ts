import express from 'express'

import {
	isAuthenticated,
	updateUserSchema,
	validateRequestBody,
} from '@/common/middlewares'

import { usersController } from '@/di'

const router = express.Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the current logged user
 *     tags: [Users]
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
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 367b2539-bef4-412b-b94d-c9d2178dcdaa
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-09-30T21:04:18.656Z
 *                       email:
 *                         type: string
 *                         example: user@email.com
 *                       name:
 *                         type: string
 *                         example: User
 *     security:
 *       - bearerAuth: []
 */
router.get('/', isAuthenticated, usersController.getUser)

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by given id and return it
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@email.com
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
 *                     id:
 *                       type: string
 *                       example: 367b2539-bef4-412b-b94d-c9d2178dcdaa
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@gmail.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-09-30T21:04:18.656Z
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
 *                       example: ["Invalid email address", "name field is required"]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
	'/',
	validateRequestBody(updateUserSchema),
	isAuthenticated,
	usersController.updateUser,
)

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Returns all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 367b2539-bef4-412b-b94d-c9d2178dcdaa
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         example: john.doe@gmail.com
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-09-30T21:04:18.656Z
 *     headers:
 *       Content-Type:
 *         description: The content type of the response
 *         schema:
 *           type: string
 *           example: application/json
 *       Authorization:
 *         description: Bearer token for authorization
 *         schema:
 *           type: string
 *           example: Bearer <token>
 */
router.get('/all', isAuthenticated, usersController.getAllUsers)

/// These endpoints should be used only for admins in RBAC access mode
// router.delete('/:id', isAuthenticated, usersController.deleteUser)
// router.post('/:id', isAuthenticated, usersController.getUser)
// router.put('/:id', isAuthenticated, usersController.updateUser)

export default router
