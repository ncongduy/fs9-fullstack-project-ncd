import express from 'express'

import {
  findAll,
  findById,
  updateUser,
  deleteUser,
  createUser,
} from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.get('/', findAll)
router.get('/:userId', findById)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.post('/', createUser)

export default router
