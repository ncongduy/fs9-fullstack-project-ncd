import { BookDocument } from '../types';

class BookApi {
  baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:3001/api/v1/books';
  }

  async getAllBooks() {
    try {
      const fetchData = await fetch(`${this.baseUrl}`);
      if (!fetchData.ok) throw new Error(`${fetchData.status} Can not fetch data`);

      const responseData = await fetchData.json();
      return responseData;
    } catch (error) {
      return error;
    }
  }

  async getOneBook(bookId: string) {
    try {
      const fetchData = await fetch(`${this.baseUrl}/${bookId}`);
      if (!fetchData.ok) throw new Error(`${fetchData.status} Can not fetch data`);

      const responseData = await fetchData.json();
      return responseData;
    } catch (error) {
      return error;
    }
  }

  async createBook(data: BookDocument) {
    try {
      const fetchData = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      });

      if (!fetchData.ok) throw new Error(`${fetchData.status} Can not post data`);

      return data;
    } catch (error) {
      return error;
    }
  }

  async updateBook(bookId: string, data: BookDocument) {
    try {
      const fetchData = await fetch(`${this.baseUrl}/${bookId}`, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      });

      if (!fetchData.ok) throw new Error(`${fetchData.status} Can not post data`);

      return data;
    } catch (error) {
      return error;
    }
  }

  async deleteBook(bookId: string) {
    try {
      const fetchData = await fetch(`${this.baseUrl}/${bookId}`, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({}),
      });

      if (!fetchData.ok) throw new Error(`${fetchData.status} Can not delete data`);
    } catch (error) {
      return error;
    }
  }
}

const bookApi = new BookApi();

export default bookApi;
