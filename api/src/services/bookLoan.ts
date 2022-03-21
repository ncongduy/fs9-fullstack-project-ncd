import BookLoan, { BookLoanDocument } from '../models/BookLoan'
import Book from '../models/Book'
import User from '../models/User'
import { NotFoundError } from '../helpers/apiError'

const validate = async (userId: string, bookId: string): Promise<boolean> => {
  const foundUser = await User.findById(userId)
  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }

  const foundBook = await Book.findById(bookId)
  if (!foundBook) {
    throw new NotFoundError(`Book ${bookId} not found`)
  }

  return true
}

const create = async (bookLoan: BookLoanDocument): Promise<BookLoanDocument> => {
  return bookLoan.save()
}

const findById = async (bookLoanId: string): Promise<BookLoanDocument> => {
  const foundBookLoan = await BookLoan.findById(bookLoanId)

  if (!foundBookLoan) {
    throw new NotFoundError(`Book loan ${bookLoanId} not found`)
  }

  return foundBookLoan
}

const findAll = async (): Promise<BookLoanDocument[]> => {
  return BookLoan.find().sort({ bookId: 1 })
}

const update = async (
  bookLoanId: string,
  update: Partial<BookLoanDocument>
): Promise<BookLoanDocument | null> => {
  const foundBookLoan = await BookLoan.findByIdAndUpdate(bookLoanId, update, {
    new: true,
  })

  if (!foundBookLoan) {
    throw new NotFoundError(`Book loan ${bookLoanId} not found`)
  }

  return foundBookLoan
}

const deleteBookLoan = async (bookLoanId: string): Promise<BookLoanDocument | null> => {
  const foundBookLoan = BookLoan.findByIdAndDelete(bookLoanId)

  if (!foundBookLoan) {
    throw new NotFoundError(`Book loan ${bookLoanId} not found`)
  }

  return foundBookLoan
}

export default {
  validate,
  create,
  findById,
  findAll,
  update,
  deleteBookLoan,
}
