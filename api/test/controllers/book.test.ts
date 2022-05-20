import request from 'supertest'

import { BookDocument } from '../../src/models/Book'
import app from '../../src/app'
import connect, { MongodHelper } from '../db-helper'

const nonExistingBookId = '5e57b77b5744fa0b461c7906'
const nonAuthorizedToken = `Bearer`
const adminToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5jb25nZHV5QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1MzAzMDIxNH0.oCXfl1lGdnCnywB8D-LSTh8wFYICVLK2OZbFb8YBJo4`
const userToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5oaUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTY1MzAzNjYyNX0._JLRjCwf_vIL_vkSa5ZZLoblX-RoGfHUKhDDcglOz5M`

async function createBook(override?: Partial<BookDocument>, token?: string) {
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

  return await request(app).post('/api/v1/books').send(book).set({ Authorization: token })
}

async function updateBook(token?: string) {
  let res = await createBook({}, adminToken)
  expect(res.status).toBe(200)

  const bookId = res.body._id
  const update = {
    title: 'Love myself',
    publishedYear: 2018,
  }

  res = await request(app).put(`/api/v1/books/${bookId}`).send(update).set({ Authorization: token })
  return res
}

async function deleteBook(token?: string) {
  let res = await createBook({}, adminToken)
  expect(res.status).toBe(200)
  const bookId = res.body._id

  res = await request(app).delete(`/api/v1/books/${bookId}`).set({ Authorization: token })
  return res
}

describe('book controller', () => {
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

  it('should not create a book without admin authorization', async () => {
    const res = await createBook({}, nonAuthorizedToken)
    expect(res.status).toBe(401)
  })

  it('should not create a book with user authorization', async () => {
    const res = await createBook({}, userToken)
    expect(res.status).toBe(403)
  })

  it('should create a book with admin authorization', async () => {
    const res = await createBook({}, adminToken)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.title).toBe('Understanding your heart')
    expect(res.body.publishedYear).toBe(2016)
    expect(res.body.page).toBe(200)
    expect(res.body.rating).toBe(5)
    expect(res.body.author).toBe('Minh Niem')
    expect(res.body.image).toBe('http://image')
  })

  it('should not create a book with wrong data with admin authorization', async () => {
    const res = await request(app)
      .post('/api/v1/books')
      .send({
        title: 'Understanding your heart',
        publishedYear: 2016,
        page: 200,
        rating: 5,
        // author: 'Minh Niem',
        // image: 'http://image',
      })
      .set({ Authorization: adminToken })

    expect(res.status).toBe(400)
  })

  it('should get back an existing book', async () => {
    let res = await createBook({}, adminToken)
    expect(res.status).toBe(200)

    const bookId = res.body._id
    res = await request(app).get(`/api/v1/books/${bookId}`)
    expect(res.body._id).toEqual(bookId)
  })

  it('should not get back a non-existing book', async () => {
    const res = await request(app).get(`/api/v1/books/${nonExistingBookId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all book', async () => {
    const res1 = await createBook(
      {
        title: 'Understanding your heart',
        publishedYear: 2016,
        page: 200,
        rating: 5,
        author: 'Minh Niem',
        image: 'http://image',
      },
      adminToken
    )
    const res2 = await createBook(
      {
        title: 'Work as a journey',
        publishedYear: 2016,
        page: 200,
        rating: 5,
        author: 'Minh Niem',
        image: 'http://image',
      },
      adminToken
    )

    const res3 = await request(app).get('/api/v1/books')

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should not update an existing book without admin authorization', async () => {
    const res = await updateBook(nonAuthorizedToken)
    expect(res.status).toEqual(401)
  })

  it('should not update an existing book with user authorization', async () => {
    const res = await updateBook(userToken)
    expect(res.status).toEqual(403)
  })

  it('should update an existing book with admin authorization', async () => {
    const res = await updateBook(adminToken)
    expect(res.status).toEqual(200)
    expect(res.body.title).toEqual('Love myself')
    expect(res.body.publishedYear).toEqual(2018)
  })

  it('should not delete an existing book without admin authorization', async () => {
    const res = await deleteBook(nonAuthorizedToken)
    expect(res.status).toEqual(401)
  })

  it('should not delete an existing book with user authorization', async () => {
    const res = await deleteBook(userToken)
    expect(res.status).toEqual(403)
  })

  it('should delete an existing book with admin authorization', async () => {
    const res = await deleteBook(adminToken)
    expect(res.status).toEqual(204)
  })
})
