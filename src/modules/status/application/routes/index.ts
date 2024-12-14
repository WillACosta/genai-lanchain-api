import express from 'express'

const router = express.Router()

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Returns a message to validade if API server is running
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Systems up and running!
 */
router.get('/', (_, res) => {
	res.status(200).send({ message: 'Systems up and running!' })
})

export default router
