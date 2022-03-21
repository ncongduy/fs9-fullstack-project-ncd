import { Request, Response, NextFunction } from 'express'

import BookLoan from '../models/BookLoan'
import BookLoanServices from '../services/bookLoan'
import { BadRequestError } from '../helpers/apiError'

// POST /bookloans
export const createBookLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, bookId } = req.body
    const validate = await BookLoanServices.validate(userId, bookId)

    if (validate) {
      const bookLoan = new BookLoan({ userId, bookId })
      await BookLoanServices.create(bookLoan)
      res.json(bookLoan)
    }
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /bookloans/:id
export const updateBookLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const update = req.body
    const id = req.params.id
    const updateBookLoan = await BookLoanServices.update(id, update)
    res.json(updateBookLoan)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /bookloans/:id
export const deleteBookLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await BookLoanServices.deleteBookLoan(req.params.id)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /bookloans/:id
export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await BookLoanServices.findById(req.params.id))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /bookloans
export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await BookLoanServices.findAll())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
