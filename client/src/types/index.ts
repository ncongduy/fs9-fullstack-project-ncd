export type BookDocument = {
  title: string
  publishedYear: number
  page: number
  rating: number
  author: string
  image: string
}

export type UserDocument = {
  firstName: string
  lastName: string
  email: string
  role: string
}

export type BookLoanDocument = {
  bookId: string
  userId: string
}
