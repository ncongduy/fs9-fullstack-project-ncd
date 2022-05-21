import axiosClient from './axiosClient'
import { BookDocument } from '../types'

const bookApi = {
  getAllBooks() {
    const url = `/books`
    return axiosClient.get(url)
  },

  getOneBook(bookId: string) {
    const url = `/books/${bookId}`
    return axiosClient.get(url)
  },

  createBook(data: BookDocument) {
    const url = `/books`
    return axiosClient.post(url, data)
  },

  updateBook(bookId: string, data: BookDocument) {
    const url = `/books/${bookId}`
    return axiosClient.put(url, data)
  },

  deleteBook(bookId: string) {
    const url = `/books/${bookId}`
    return axiosClient.delete(url)
  },
}

export default bookApi
