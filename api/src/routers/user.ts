import express from 'express'
import passport from 'passport'

import {
  findAll,
  findById,
  updateUser,
  deleteUser,
  createUser,
  googleLogin,
} from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.get('/', findAll)
router.get('/:userId', findById)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.post('/', createUser)
router.post(
  '/google-login',
  passport.authenticate('google-id-token', { session: false }),
  googleLogin
)

export default router
