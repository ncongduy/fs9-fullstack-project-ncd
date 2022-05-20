import User from '../../src/models/User'
import UserServices from '../../src/services/user'
import Book from '../../src/models/Book'
import BookServices from '../../src/services/book'
import BookLoan from '../../src/models/BookLoan'
import BookLoanServices from '../../src/services/bookLoan'
import connect, { MongodHelper } from '../db-helper'

async function createBook() {
  const book = {
    title: 'Understanding your heart',
    publishedYear: 2016,
    page: 200,
    rating: 5,
    author: 'Minh Niem',
    image: 'http://image',
  }

  return await BookServices.create(new Book(book))
}

async function createUser() {
  const user = {
    firstName: 'Pauli',
    lastName: 'Nguyen',
    email: 'pauli@gmail.com',
  }

  return await UserServices.create(new User(user))
}

async function borrowBook() {
  const user = await createUser()
  const book = await createBook()

  const bookLoan = new BookLoan({
    userId: user._id,
    bookId: book._id,
  })

  return await BookLoanServices.borrowBook(bookLoan)
}

describe('book loan service', () => {
  let mongodHelper: MongodHelper

  beforeAll(async () => {
    mongodHelper = await connect()
  })

  afterEach(async () => {
    await mongodHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodHelper.closeDatabase()
  })

  it('should validate an existing user and book', async () => {
    const user = await createUser()
    const book = await createBook()

    const validate = await BookLoanServices.validate(user._id, book._id)

    expect(validate).toEqual(true)
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should validate a non-existing user', async () => {
    const nonExistingUserId = '5e57b77b5744fa0b461c7906'
    const book = await createBook()

    return await BookLoanServices.validate(nonExistingUserId, book._id).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })

  it('should validate a non-existing book', async () => {
    const user = await createUser()
    const nonExistingBookId = '5e57b77b5744fa0b461c7906'

    return await BookLoanServices.validate(user._id, nonExistingBookId).catch((e) => {
      expect(e.message).toMatch(`Book ${nonExistingBookId} not found`)
    })
  })

  it('borrow a book', async () => {
    const bookLoan = await borrowBook()

    expect(bookLoan).toHaveProperty('_id')
    expect(bookLoan).toHaveProperty('userId')
    expect(bookLoan).toHaveProperty('bookId')
  })

  it('return a book', async () => {
    const bookLoan = await borrowBook()
    await BookLoanServices.returnBook(bookLoan._id)

    return await BookLoanServices.returnBook(bookLoan._id).catch((e) => {
      expect(e.message).toMatch(`Book loan ${bookLoan._id} not found`)
    })
  })
})
