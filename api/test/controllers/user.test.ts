import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import connect, { MongodHelper } from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'
const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5jb25nZHV5QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1MzAzMDIxNH0.oCXfl1lGdnCnywB8D-LSTh8wFYICVLK2OZbFb8YBJo4`

async function createUser(override?: Partial<UserDocument>) {
  let user = {
    firstName: 'Pauli',
    lastName: 'Nguyen',
    email: 'pauli@gmail.com',
  }

  if (override) {
    user = { ...user, ...override }
  }

  return await request(app).post('/api/v1/users').send(user).set({ Authorization: token })
}

describe('user controller', () => {
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

  it('should not create a user without authorization', async () => {
    const res = await request(app).post('/api/v1/users').send({
      firstName: 'Pauli',
      lastName: 'Nguyen',
      email: 'pauli@gmail.com',
    })

    expect(res.status).toBe(401)
  })

  it('should create a user', async () => {
    const res = await createUser()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.firstName).toBe('Pauli')
    expect(res.body.lastName).toBe('Nguyen')
    expect(res.body.email).toBe('pauli@gmail.com')
  })

  it('should not create a user with wrong data', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        // firstName: 'Pauli',
        // lastName: 'Nguyen',
        email: 'pauli@gmail.com',
      })
      .set({ Authorization: token })

    expect(res.status).toBe(400)
  })

  it('should not get back an existing user without authorization', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    res = await request(app).get(`/api/v1/users/${userId}`)

    expect(res.status).toEqual(401)
  })

  it('should get back an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    res = await request(app).get(`/api/v1/users/${userId}`).set({ Authorization: token })

    expect(res.body._id).toEqual(userId)
  })

  it('should not get back a non-existing user', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${nonExistingUserId}`)
      .set({ Authorization: token })
    expect(res.status).toBe(404)
  })

  it('should not get back all user without authorization', async () => {
    const res1 = await createUser({
      firstName: 'Bao',
      lastName: 'Tran',
      email: 'bao@gmail.com',
    })

    const res2 = await createUser({
      firstName: 'Nhi',
      lastName: 'Le',
      email: 'nhi@gmail.com',
    })

    const res3 = await request(app).get('/api/v1/users')

    expect(res3.status).toBe(401)
  })

  it('should get back all user', async () => {
    const res1 = await createUser({
      firstName: 'Bao',
      lastName: 'Tran',
      email: 'bao@gmail.com',
    })

    const res2 = await createUser({
      firstName: 'Nhi',
      lastName: 'Le',
      email: 'nhi@gmail.com',
    })

    const res3 = await request(app).get('/api/v1/users').set({ Authorization: token })

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should not update an existing user without authorization', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    const update = {
      firstName: 'Bao',
      lastName: 'Tran',
    }

    res = await request(app).put(`/api/v1/users/${userId}`).send(update)

    expect(res.status).toEqual(401)
  })

  it('should update an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    const update = {
      firstName: 'Bao',
      lastName: 'Tran',
    }

    res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send(update)
      .set({ Authorization: token })

    expect(res.status).toEqual(200)
    expect(res.body.firstName).toEqual('Bao')
    expect(res.body.lastName).toEqual('Tran')
  })

  it('should not delete an existing user without authorization', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)
    const userId = res.body._id

    res = await request(app).delete(`/api/v1/users/${userId}`)

    expect(res.status).toEqual(401)
  })

  it('should delete an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)
    const userId = res.body._id

    res = await request(app).delete(`/api/v1/users/${userId}`).set({ Authorization: token })

    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/books/${userId}`)
    expect(res.status).toBe(404)
  })
})
