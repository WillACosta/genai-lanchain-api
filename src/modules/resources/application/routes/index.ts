import express from 'express'

import { isAuthenticated } from '@/common/middlewares'
import { resourcesController } from '@/di'

const router = express.Router()

/**
 * @swagger
 * /resources/docs:
 *   post:
 *     tags:
 *       - Resources
 *     summary: Upload, split and store PDF documents into the vector database
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Successfully uploaded and stored documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       originalName:
 *                         type: string
 *                         example: essay.pdf
 *                       fileName:
 *                         type: string
 *                         example: essay-undsq123aq.pdf
 *                       path:
 *                         type: string
 *                         example: /uploads/essay-undsq123aq.pdf
 *                       size:
 *                         type: integer
 *                         example: 1200
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Please provide at least one file!
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
 */
router.post('/docs', isAuthenticated, resourcesController.uploadDocs)

export default router
