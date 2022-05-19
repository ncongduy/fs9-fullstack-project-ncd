import express from 'express'
import passport from 'passport'

import { findAll, findById, deleteBookLoan, createBookLoan } from '../controllers/bookLoan'

const router = express.Router()

// Every path we define here will get /api/v1/bookloans prefix
router.use(['/', '/:slug'], passport.authenticate('jwt', { session: false }))
router.post('/', createBookLoan)
router.delete('/:id', deleteBookLoan)
router.get('/', findAll)
// router.get('/:id', findById)
// router.put('/:id', updateBookLoan)

export default router
