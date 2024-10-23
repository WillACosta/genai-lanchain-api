import express from 'express'

import { isAuthenticated } from '@/common/middlewares'
import { usersController } from '@/di'

const router = express.Router()

router.get('/', isAuthenticated, usersController.getUser)
router.patch('/', isAuthenticated, usersController.updateUser)

router.get('/all', isAuthenticated, usersController.getAllUsers)

router.delete('/:id', isAuthenticated, usersController.deleteUser)
router.post('/:id', isAuthenticated, usersController.getUser)

router.put('/:id', isAuthenticated, usersController.updateUser)

export default router
