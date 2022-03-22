import Book from '../../src/models/Book';
import BookServices from '../../src/services/book';
import connect, { MongodHelper } from '../db-helper';

const nonExistingBookId = '5e57b77b5744fa0b461c7906';

async function createBook() {
  const movie = new Book({
    title: 'Understanding your heart',
    publishedYear: 2016,
    genres: 'Psychology',
    page: 200,
    rating: 5,
    quantity: 20,
    author: 'Minh Niem',
    image: 'http://image',
  });
  return await BookServices.create(movie);
}

describe('book service', () => {
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

  it('should create a book', async () => {
    const book = await createBook();

    expect(book).toHaveProperty('_id');
    expect(book).toHaveProperty('title', 'Understanding your heart');
    expect(book).toHaveProperty('publishedYear', 2016);
    expect(book).toHaveProperty('genres', 'Psychology');
    expect(book).toHaveProperty('page', 200);
    expect(book).toHaveProperty('rating', 5);
    expect(book).toHaveProperty('quantity', 20);
    expect(book).toHaveProperty('author', 'Minh Niem');
    expect(book).toHaveProperty('image', 'http://image');
  });

  it('should get a book with id', async () => {
    const book = await createBook();
    const found = await BookServices.findById(book._id);

    expect(found.title).toEqual(book.title);
    expect(found._id).toEqual(book._id);
  });

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing book', async () => {
    expect.assertions(1);

    return BookServices.findById(nonExistingBookId).catch((e) => {
      expect(e.message).toMatch(`Book ${nonExistingBookId} not found`);
    });
  });

  it('should update an existing book', async () => {
    const book = await createBook();
    const update = {
      title: 'Work as a journey',
      publishedYear: 2018,
    };
    const updated = await BookServices.update(book._id, update);

    expect(updated).toHaveProperty('_id', book._id);
    expect(updated).toHaveProperty('title', 'Work as a journey');
    expect(updated).toHaveProperty('publishedYear', 2018);
  });

  it('should not update a non-existing book', async () => {
    expect.assertions(1);

    const update = {
      title: 'Work as a journey',
      publishedYear: 2018,
    };

    return BookServices.update(nonExistingBookId, update).catch((e) => {
      expect(e.message).toMatch(`Book ${nonExistingBookId} not found`);
    });
  });

  it('should delete an existing book', async () => {
    expect.assertions(1);
    const book = await createBook();

    await BookServices.deleteBook(book._id);
    return BookServices.findById(book._id).catch((e) => {
      expect(e.message).toBe(`Book ${book._id} not found`);
    });
  });
});
