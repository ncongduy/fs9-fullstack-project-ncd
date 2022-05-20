import express from 'express'
import passport from 'passport'

import { borrowBook, returnBook, findAllBookLoans } from '../controllers/bookLoan'

const router = express.Router()

// Every path we define here will get /api/v1/bookloans prefix
router.use(['/', '/:slug'], passport.authenticate('jwt', { session: false }))
router.post('/', borrowBook)
router.delete('/:id', returnBook)
router.get('/:userId', findAllBookLoans)

export default router
