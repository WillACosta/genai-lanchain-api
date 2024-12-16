import express from 'express'

import { isAuthenticated } from '@/common/middlewares'
import { resourcesController } from '@/di'

const router = express.Router()

router.post('/docs', isAuthenticated, resourcesController.uploadDocs)

export default router
