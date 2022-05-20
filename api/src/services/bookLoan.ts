import BookLoan, { BookLoanDocument } from '../models/BookLoan'
import Book, { BookDocument } from '../models/Book'
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

const borrowBook = async (bookLoan: BookLoanDocument): Promise<BookLoanDocument> => {
  return bookLoan.save()
}

const findAllBookByUserId = async (userId: string): Promise<BookDocument[]> => {
  const foundAllBookLoan = await BookLoan.find({ userId: userId })
  if (foundAllBookLoan.length === 0) throw new NotFoundError(`User ${userId} does not borrow book`)

  const allBookId = foundAllBookLoan.map((bookloan) => bookloan.bookId)
  const allBooks = await Book.find({ _id: { $in: allBookId } })

  return allBooks
}

const returnBook = async (bookLoanId: string): Promise<BookLoanDocument | null> => {
  const foundBookLoan = BookLoan.findByIdAndDelete(bookLoanId)

  if (!foundBookLoan) {
    throw new NotFoundError(`Book loan ${bookLoanId} not found`)
  }

  return foundBookLoan
}

export default {
  validate,
  borrowBook,
  findAllBookByUserId,
  returnBook,
}
