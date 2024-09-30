import express from 'express'

import { usersController } from '@/di'

const router = express.Router()

router.get('/', usersController.getUser)
router.patch('/', usersController.updateUser)

router.get('/all', usersController.getAllUsers)

router.delete('/:id', usersController.deleteUser)
router.post('/:id', usersController.getUser)

router.put('/:id', usersController.updateUser)

export default router
