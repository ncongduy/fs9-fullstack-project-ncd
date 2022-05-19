import express from 'express'
import passport from 'passport'

import {
  findAll,
  findById,
  updateUser,
  deleteUser,
  createUser,
  googleLogin,
  authorize,
} from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.post(
  '/google-login',
  passport.authenticate('google-id-token', { session: false }),
  googleLogin
)
router.use(['/', '/:userId'], passport.authenticate('jwt', { session: false }), authorize)
router.get('/', findAll)
router.get('/:userId', findById)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.post('/', createUser)

export default router
