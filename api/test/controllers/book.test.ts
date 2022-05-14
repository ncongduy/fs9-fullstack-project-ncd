import request from 'supertest'

import { BookDocument } from '../../src/models/Book'
import app from '../../src/app'
import connect, { MongodHelper } from '../db-helper'

const nonExistingBookId = '5e57b77b5744fa0b461c7906'

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

  return await request(app).post('/api/v1/books').send(book)
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

  it('should create a book', async () => {
    const res = await createBook()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.title).toBe('Understanding your heart')
  })

  it('should not create a book with wrong data', async () => {
    const res = await request(app).post('/api/v1/books').send({
      title: 'Understanding your heart',
      publishedYear: 2016,
      page: 200,
      rating: 5,
      // author: 'Minh Niem',
      // image: 'http://image',
    })
    expect(res.status).toBe(400)
  })

  it('should get back an existing book', async () => {
    let res = await createBook()
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
    const res1 = await createBook({
      title: 'Understanding your heart',
      publishedYear: 2016,
      page: 200,
      rating: 5,
      author: 'Minh Niem',
      image: 'http://image',
    })
    const res2 = await createBook({
      title: 'Work as a journey',
      publishedYear: 2016,
      page: 200,
      rating: 5,
      author: 'Minh Niem',
      image: 'http://image',
    })

    const res3 = await request(app).get('/api/v1/books')

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing book', async () => {
    let res = await createBook()
    expect(res.status).toBe(200)

    const bookId = res.body._id
    const update = {
      title: 'Love myself',
      publishedYear: 2018,
    }

    res = await request(app).put(`/api/v1/books/${bookId}`).send(update)

    expect(res.status).toEqual(200)
    expect(res.body.title).toEqual('Love myself')
    expect(res.body.publishedYear).toEqual(2018)
  })

  it('should delete an existing book', async () => {
    let res = await createBook()
    expect(res.status).toBe(200)
    const bookId = res.body._id

    res = await request(app).delete(`/api/v1/books/${bookId}`)

    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/books/${bookId}`)
    expect(res.status).toBe(404)
  })
})
