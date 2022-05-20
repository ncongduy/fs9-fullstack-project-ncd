import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import connect, { MongodHelper } from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'
const nonAuthorizedToken = `Bearer`
const adminToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5jb25nZHV5QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1MzAzMDIxNH0.oCXfl1lGdnCnywB8D-LSTh8wFYICVLK2OZbFb8YBJo4`
const userToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5oaUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTY1MzAzNjYyNX0._JLRjCwf_vIL_vkSa5ZZLoblX-RoGfHUKhDDcglOz5M`

async function createUser(override?: Partial<UserDocument>, token?: string) {
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

async function findUser(token?: string) {
  let res = await createUser({}, adminToken)
  expect(res.status).toBe(200)

  const userId = res.body._id
  res = await request(app).get(`/api/v1/users/${userId}`).set({ Authorization: token })
  return res
}

async function findAllUsers(token?: string) {
  await createUser(
    {
      firstName: 'Bao',
      lastName: 'Tran',
      email: 'bao@gmail.com',
    },
    adminToken
  )

  await createUser(
    {
      firstName: 'Nhi',
      lastName: 'Le',
      email: 'nhi@gmail.com',
    },
    adminToken
  )

  const res = await request(app).get('/api/v1/users').set({ Authorization: token })
  return res
}

async function updateUser(token?: string) {
  let res = await createUser({}, adminToken)
  expect(res.status).toBe(200)

  const userId = res.body._id
  const update = {
    firstName: 'Bao',
    lastName: 'Tran',
  }

  res = await request(app).put(`/api/v1/users/${userId}`).send(update).set({ Authorization: token })
  return res
}

async function deleteUser(token?: string) {
  let res = await createUser({}, adminToken)
  expect(res.status).toBe(200)
  const userId = res.body._id

  res = await request(app).delete(`/api/v1/users/${userId}`).set({ Authorization: token })
  return res
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

  it('should not create a user without admin authorization', async () => {
    const res = await createUser({}, nonAuthorizedToken)
    expect(res.status).toBe(401)
  })

  it('should not create a user with user authorization', async () => {
    const res = await createUser({}, userToken)
    expect(res.status).toBe(403)
  })

  it('should create a user', async () => {
    const res = await createUser({}, adminToken)
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
      .set({ Authorization: adminToken })

    expect(res.status).toBe(400)
  })

  it('should not get back an existing user without admin authorization', async () => {
    const res = await findUser(nonAuthorizedToken)
    expect(res.status).toEqual(401)
  })

  it('should not get back an existing user with user authorization', async () => {
    const res = await findUser(userToken)
    expect(res.status).toEqual(403)
  })

  it('should get back an existing user with admin authorization', async () => {
    const res = await findUser(adminToken)
    expect(res.status).toEqual(200)
  })

  it('should not get back a non-existing user with admin authorization', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${nonExistingUserId}`)
      .set({ Authorization: adminToken })
    expect(res.status).toBe(404)
  })

  it('should not get back all user without authorization', async () => {
    const res = await findAllUsers(nonAuthorizedToken)
    expect(res.status).toBe(401)
  })

  it('should not get back all user with user authorization', async () => {
    const res = await findAllUsers(userToken)
    expect(res.status).toBe(403)
  })

  it('should get back all user', async () => {
    const res = await findAllUsers(adminToken)
    expect(res.status).toBe(200)
    expect(res.body.length).toEqual(2)
  })

  it('should not update an existing user without authorization', async () => {
    const res = await updateUser(nonAuthorizedToken)
    expect(res.status).toEqual(401)
  })

  it('should not update an existing user with user authorization', async () => {
    const res = await updateUser(userToken)
    expect(res.status).toEqual(403)
  })

  it('should update an existing user with admin authorization', async () => {
    const res = await updateUser(adminToken)
    expect(res.status).toEqual(200)
  })

  it('should not delete an existing user without authorization', async () => {
    const res = await deleteUser(nonAuthorizedToken)
    expect(res.status).toEqual(401)
  })

  it('should not delete an existing user with user authorization', async () => {
    const res = await deleteUser(userToken)
    expect(res.status).toEqual(403)
  })

  it('should delete an existing user', async () => {
    const res = await deleteUser(adminToken)
    expect(res.status).toEqual(204)
  })
})
