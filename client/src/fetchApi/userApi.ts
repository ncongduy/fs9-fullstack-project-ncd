import { UserDocument } from '../types';

class UserApi {
  baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:3001/api/v1/users';
  }

  async getAllUsers() {
    try {
      const fetchData = await fetch(`${this.baseUrl}`);
      if (!fetchData.ok) throw new Error(`${fetchData.status} Can not fetch data`);

      const responseData = await fetchData.json();
      return responseData;
    } catch (error) {
      return `${error}`;
    }
  }

  async getOneUser(userId: string) {
    try {
      const fetchData = await fetch(`${this.baseUrl}/${userId}`);
      if (!fetchData.ok) throw new Error(`${fetchData.status} Can not fetch data`);

      const responseData = await fetchData.json();
      return responseData;
    } catch (error) {
      return `${error}`;
    }
  }

  async createUser(data: UserDocument) {
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
      return `${error}`;
    }
  }

  async updateUser(bookId: string, data: UserDocument) {
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

      if (!fetchData.ok) throw new Error(`${fetchData.status} Can not put data`);

      return data;
    } catch (error) {
      return `${error}`;
    }
  }

  async deleteUser(userId: string) {
    try {
      const fetchData = await fetch(`${this.baseUrl}/${userId}`, {
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
      return `${error}`;
    }
  }
}

const userApi = new UserApi();

export default userApi;
