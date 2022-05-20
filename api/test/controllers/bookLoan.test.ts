import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import { BookDocument } from '../../src/models/Book'
import app from '../../src/app'
import connect, { MongodHelper } from '../db-helper'

//const nonExistingBookloanId = '5e57b77b5744fa0b461c7906'
const nonAuthorizedToken = `Bearer`
const adminToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5jb25nZHV5QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1MzAzMDIxNH0.oCXfl1lGdnCnywB8D-LSTh8wFYICVLK2OZbFb8YBJo4`
const userToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5oaUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTY1MzAzNjYyNX0._JLRjCwf_vIL_vkSa5ZZLoblX-RoGfHUKhDDcglOz5M`

async function createUser(override?: Partial<UserDocument>) {
  let user = {
    firstName: 'Pauli',
    lastName: 'Nguyen',
    email: 'pauli@gmail.com',
  }

  if (override) {
    user = { ...user, ...override }
  }

  return await request(app).post('/api/v1/users').send(user).set({ Authorization: adminToken })
}

async function createBook(override?: Partial<BookDocument>) {
  let book = {
    title: 'Understanding your heart',
    publishedYear: 2016,
    page: 200,
    rating: 5,
    author: 'Minh Niem',
    image: 'http://image',
  }

  if (override) {
    book = { ...book, ...override }
  }

  return await request(app).post('/api/v1/books').send(book).set({ Authorization: adminToken })
}

async function borrowBook(
  userArg?: Partial<UserDocument>,
  bookArg?: Partial<BookDocument>,
  token?: string
) {
  const user = await createUser(userArg)
  const book = await createBook(bookArg)

  const bookLoan = {
    userId: user.body._id,
    bookId: book.body._id,
  }

  return await request(app).post('/api/v1/bookloans').send(bookLoan).set({ Authorization: token })
}

async function returnBook(token?: string) {
  let res = await borrowBook({}, {}, userToken)
  expect(res.status).toBe(200)
  const bookLoanId = res.body._id

  res = await request(app).delete(`/api/v1/bookloans/${bookLoanId}`).set({ Authorization: token })
  return res
}

async function findAllBookLoans(token?: string) {
  const user = await createUser()
  const book1 = await createBook()
  const book2 = await createBook({
    title: 'Work life balance',
    publishedYear: 2022,
    page: 100,
    rating: 5,
    author: 'No name',
    image: 'http://image',
  })

  await request(app)
    .post('/api/v1/bookloans')
    .send({ userId: user.body._id, bookId: book1.body._id })
    .set({ Authorization: userToken })

  await request(app)
    .post('/api/v1/bookloans')
    .send({ userId: user.body._id, bookId: book2.body._id })
    .set({ Authorization: userToken })

  const res = await request(app)
    .get(`/api/v1/bookloans/${user.body._id}`)
    .set({ Authorization: token })

  return res
}

describe('book loan controller', () => {
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

  it('can not borrow book without authorization', async () => {
    const res = await borrowBook({}, {}, nonAuthorizedToken)
    expect(res.status).toBe(401)
  })

  it('can borrow with authorization', async () => {
    const res = await borrowBook({}, {}, userToken)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body).toHaveProperty('userId')
    expect(res.body).toHaveProperty('bookId')
  })

  it('can not borrow book with wrong data', async () => {
    const user = await createUser()

    const bookLoan = {
      userId: user.body._id,
      // bookId: book.body._id,
    }

    const res = await request(app)
      .post('/api/v1/bookloans')
      .send(bookLoan)
      .set({ Authorization: userToken })

    expect(res.status).toBe(404)
  })

  it('can not return book without authorization', async () => {
    const res = await returnBook(nonAuthorizedToken)
    expect(res.status).toEqual(401)
  })

  it('can return book with authorization', async () => {
    const res = await returnBook(userToken)
    expect(res.status).toEqual(204)
  })

  it('should not return all book loan without authorization', async () => {
    const res = await findAllBookLoans(nonAuthorizedToken)
    expect(res.status).toBe(401)
  })

  it('should return all book loan with authorization', async () => {
    const res = await findAllBookLoans(userToken)
    expect(res.status).toBe(200)
    expect(res.body.length).toEqual(2)
  })
})
