export type BookDocument = {
  title: string;
  publishedYear: number;
  genre: string;
  page: number;
  rating: number;
  quantity: number;
  author: string;
  image: string;
};

export type UserDocument = {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  address: string;
};
