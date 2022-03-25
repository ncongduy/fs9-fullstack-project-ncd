import request from 'supertest';

import { UserDocument } from '../../src/models/User';
import app from '../../src/app';
import connect, { MongodHelper } from '../db-helper';

const nonExistingUserId = '5e57b77b5744fa0b461c7906';

async function createUser(override?: Partial<UserDocument>) {
  let user = {
    firstName: 'Pauli',
    lastName: 'Nguyen',
    email: 'pauli@gmail.com',
    phone: 123456789,
    address: 'Helsinki, Finland',
  };

  if (override) {
    user = { ...user, ...override };
  }

  return await request(app).post('/api/v1/users').send(user);
}

describe('user controller', () => {
  let mongodHelper: MongodHelper;

  beforeAll(async () => {
    mongodHelper = await connect();
  });

  afterEach(async () => {
    await mongodHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongodHelper.closeDatabase();
  });

  it('should create a user', async () => {
    const res = await createUser();
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.firstName).toBe('Pauli');
  });

  it('should not create a user with wrong data', async () => {
    const res = await request(app).post('/api/v1/users').send({
      // firstName: 'Pauli',
      // lastName: 'Nguyen',
      email: 'pauli@gmail.com',
      phone: 123456789,
      address: 'Helsinki, Finland',
    });
    expect(res.status).toBe(400);
  });

  it('should get back an existing user', async () => {
    let res = await createUser();
    expect(res.status).toBe(200);

    const userId = res.body._id;
    res = await request(app).get(`/api/v1/users/${userId}`);

    expect(res.body._id).toEqual(userId);
  });

  it('should not get back a non-existing user', async () => {
    const res = await request(app).get(`/api/v1/users/${nonExistingUserId}`);
    expect(res.status).toBe(404);
  });

  it('should get back all user', async () => {
    const res1 = await createUser({
      firstName: 'Bao',
      lastName: 'Tran',
      email: 'bao@gmail.com',
      phone: 234567890,
      address: 'HCM, Vietnam',
    });

    const res2 = await createUser({
      firstName: 'Nhi',
      lastName: 'Le',
      email: 'nhi@gmail.com',
      phone: 3456789012,
      address: 'Helsinki, Finland',
    });

    const res3 = await request(app).get('/api/v1/users');

    expect(res3.body.length).toEqual(2);
    expect(res3.body[0]._id).toEqual(res1.body._id);
    expect(res3.body[1]._id).toEqual(res2.body._id);
  });

  it('should update an existing user', async () => {
    let res = await createUser();
    expect(res.status).toBe(200);

    const userId = res.body._id;
    const update = {
      firstName: 'Bao',
      lastName: 'Tran',
    };

    res = await request(app).put(`/api/v1/users/${userId}`).send(update);

    expect(res.status).toEqual(200);
    expect(res.body.firstName).toEqual('Bao');
    expect(res.body.lastName).toEqual('Tran');
  });

  it('should delete an existing user', async () => {
    let res = await createUser();
    expect(res.status).toBe(200);
    const userId = res.body._id;

    res = await request(app).delete(`/api/v1/users/${userId}`);

    expect(res.status).toEqual(204);

    res = await request(app).get(`/api/v1/books/${userId}`);
    expect(res.status).toBe(404);
  });
});
