import { Request, Response, NextFunction } from 'express'

import Book from '../models/Book'
import BookServices from '../services/book'
import { BadRequestError, ForbiddenError } from '../helpers/apiError'

// Authorization
export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any
    const { role } = user
    if (role !== 'admin') next(new ForbiddenError('Unauthorized'))
    next()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// POST /books
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = new Book(req.body)
    await BookServices.create(book)
    res.json(book)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /books/:bookId
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const update = req.body
    const bookId = req.params.bookId
    const updateBook = await BookServices.update(bookId, update)
    res.json(updateBook)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /books/:bookId
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await BookServices.deleteBook(req.params.bookId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /books/:bookId
export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await BookServices.findById(req.params.bookId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /books
export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await BookServices.findAll())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
