import express from 'express'

import {
	changeUserRoleSchema,
	hasPermission,
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
 *     summary: Returns the current user
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
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
 */
router.get('/', isAuthenticated, usersController.getUser)

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update the current user and return it
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
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
 *                       example: ["Invalid email address", "name field is
 */
router.patch(
	'/',
	validateRequestBody(updateUserSchema),
	isAuthenticated,
	usersController.updateUser,
)

/**
 * @swagger
 * /users/change-role/{id}:
 *   patch:
 *     summary: Update a user role and return it, this route is used only by admins
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       200:
 *         description: Successfully updated the user role
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
 *                       role:
 *                         type: string
 *                         example: user
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
 *                         example: Role is required.
 */
router.patch(
	'/change-role/:id',
	validateRequestBody(changeUserRoleSchema),
	isAuthenticated,
	hasPermission('admin'),
	usersController.changeUserRole,
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
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
 */
router.get(
	'/all',
	isAuthenticated,
	hasPermission('admin'),
	usersController.getAllUsers,
)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by given id and return it
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
 *     responses:
 *       200:
 *         description: Successfully deleted the user
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
 *                       role:
 *                         type: string
 *                         example: user
 */
router.delete(
	'/:id',
	isAuthenticated,
	hasPermission('admin'),
	usersController.deleteUser,
)

export default router
