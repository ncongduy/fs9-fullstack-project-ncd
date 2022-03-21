import express from 'express'

import {
  findAll,
  findById,
  updateBookLoan,
  deleteBookLoan,
  createBookLoan,
} from '../controllers/bookLoan'

const router = express.Router()

// Every path we define here will get /api/v1/bookloans prefix
router.get('/', findAll)
router.get('/:id', findById)
router.put('/:id', updateBookLoan)
router.delete('/:id', deleteBookLoan)
router.post('/', createBookLoan)

export default router
