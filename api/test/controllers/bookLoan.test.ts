import request from 'supertest';

import { UserDocument } from '../../src/models/User';
import { BookDocument } from '../../src/models/Book';
import app from '../../src/app';
import connect, { MongodHelper } from '../db-helper';

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

async function createBook(override?: Partial<BookDocument>) {
  let book = {
    title: 'Understanding your heart',
    publishedYear: 2016,
    genres: 'Psychology',
    page: 200,
    rating: 5,
    quantity: 20,
    author: 'Minh Niem',
    image: 'http://image',
  };

  if (override) {
    book = { ...book, ...override };
  }

  return await request(app).post('/api/v1/books').send(book);
}

async function createBookLoan(userArg?: Partial<UserDocument>, bookArg?: Partial<BookDocument>) {
  const user = await createUser(userArg);
  const book = await createBook(bookArg);

  const bookLoan = {
    userId: user.body._id,
    bookId: book.body._id,
  };

  return await request(app).post('/api/v1/bookloans').send(bookLoan);
}

describe('book loan controller', () => {
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

  it('should create a book loan', async () => {
    const res = await createBookLoan();

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('bookId');
  });

  it('should not create a book loan with wrong data', async () => {
    const user = await createUser();

    const bookLoan = {
      userId: user.body._id,
      // bookId: book.body._id,
    };

    const res = await request(app).post('/api/v1/bookloans').send(bookLoan);
    expect(res.status).toBe(404);
  });

  it('should get back an existing book loan', async () => {
    let res = await createBookLoan();
    expect(res.status).toBe(200);

    const bookLoanId = res.body._id;
    res = await request(app).get(`/api/v1/bookloans/${bookLoanId}`);

    expect(res.body._id).toEqual(bookLoanId);
  });

  it('should not get back a non-existing book loan', async () => {
    const nonExistingBookLoanId = '5e57b77b5744fa0b461c7906';
    const res = await request(app).get(`/api/v1/bookloans/${nonExistingBookLoanId}`);
    expect(res.status).toBe(404);
  });

  it('should get back all book loan', async () => {
    const res1 = await createBookLoan(
      {
        firstName: 'Duy',
        lastName: 'Nguyen',
        email: 'duy@gmail.com',
        phone: 2345678901,
        address: 'Helsinki, Finland',
      },
      {
        title: 'Work as a journey',
        publishedYear: 2016,
        page: 200,
        rating: 5,
        quantity: 20,
        author: 'Minh Niem',
        image: 'http://image',
      }
    );

    const res2 = await createBookLoan(
      {
        firstName: 'Bao',
        lastName: 'Tran',
        email: 'bao@gmail.com',
        phone: 3456789012,
        address: 'HCM, Vietnam',
      },
      {
        title: 'Selfhelp',
        publishedYear: 2022,
        page: 200,
        rating: 4,
        quantity: 50,
        author: 'Godfather',
        image: 'http://image',
      }
    );

    const res3 = await request(app).get('/api/v1/bookloans');

    expect(res3.body.length).toEqual(2);
    expect(res3.body[0]._id).toEqual(res1.body._id);
    expect(res3.body[1]._id).toEqual(res2.body._id);
  });

  it('should delete an existing book loan', async () => {
    let res = await createBookLoan();
    expect(res.status).toBe(200);
    const bookLoanId = res.body._id;

    res = await request(app).delete(`/api/v1/bookloans/${bookLoanId}`);

    expect(res.status).toEqual(204);

    res = await request(app).get(`/api/v1/bookloans/${bookLoanId}`);
    expect(res.status).toBe(404);
  });
});
