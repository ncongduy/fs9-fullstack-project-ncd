import User from '../../src/models/User'
import UserServices from '../../src/services/user'
import connect, { MongodHelper } from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

async function createUser() {
  const user = new User({
    firstName: 'Pauli',
    lastName: 'Nguyen',
    email: 'pauli@gmail.com',
  })
  return await UserServices.create(user)
}

describe('user service', () => {
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

  it('should create a user', async () => {
    const user = await createUser()

    expect(user).toHaveProperty('_id')
    expect(user).toHaveProperty('firstName', 'Pauli')
    expect(user).toHaveProperty('lastName', 'Nguyen')
    expect(user).toHaveProperty('email', 'pauli@gmail.com')
  })

  it('should get a user with id', async () => {
    const user = await createUser()
    const found = await UserServices.findById(user._id)

    expect(found.firstName).toEqual(user.firstName)
    expect(found.lastName).toEqual(user.lastName)
    expect(found._id).toEqual(user._id)
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing user', async () => {
    expect.assertions(1)

    return UserServices.findById(nonExistingUserId).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })

  it('should update an existing user', async () => {
    const user = await createUser()
    const update = {
      firstName: 'Duy',
      email: 'duy@gmail.com',
    }
    const updated = await UserServices.update(user._id, update)

    expect(updated).toHaveProperty('_id', user._id)
    expect(updated).toHaveProperty('firstName', 'Duy')
    expect(updated).toHaveProperty('email', 'duy@gmail.com')
  })

  it('should not update a non-existing user', async () => {
    expect.assertions(1)

    const update = {
      firstName: 'Duy',
      email: 'duy@gmail.com',
    }

    return UserServices.update(nonExistingUserId, update).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })

  it('should delete an existing user', async () => {
    expect.assertions(1)
    const user = await createUser()

    await UserServices.deleteUser(user._id)
    return UserServices.findById(user._id).catch((e) => {
      expect(e.message).toBe(`User ${user._id} not found`)
    })
  })
})
