import express from 'express'
import passport from 'passport'

import {
  createBook,
  findById,
  deleteBook,
  findAll,
  updateBook,
  authorize,
} from '../controllers/book'

const router = express.Router()

// Every path we define here will get /api/v1/books prefix
router.get('/', findAll)
router.get('/:bookId', findById)
router.use(['/', '/:bookId'], passport.authenticate('jwt', { session: false }), authorize)
router.put('/:bookId', updateBook)
router.delete('/:bookId', deleteBook)
router.post('/', createBook)

export default router
