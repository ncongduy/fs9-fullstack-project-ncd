import { Request, Response, NextFunction } from 'express'

import BookLoan from '../models/BookLoan'
import BookLoanServices from '../services/bookLoan'
import { BadRequestError } from '../helpers/apiError'

// POST /bookloans
export const borrowBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, bookId } = req.body
    const validate = await BookLoanServices.validate(userId, bookId)

    if (validate) {
      const bookLoan = new BookLoan({ userId, bookId })
      await BookLoanServices.borrowBook(bookLoan)
      res.status(200).json(bookLoan)
    }
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /bookloans/:id
export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await BookLoanServices.returnBook(req.params.id)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /bookloans/:userId
export const findAllBookLoans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    const allBooks = await BookLoanServices.findAllBookByUserId(userId)
    res.status(200).json(allBooks)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
