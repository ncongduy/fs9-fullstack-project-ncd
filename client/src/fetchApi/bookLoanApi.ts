import axiosClient from './axiosClient'
import { BookLoanDocument } from '../types'

const userApi = {
  getAllBookLoans(userId: string) {
    const url = `/bookloans/${userId}`
    return axiosClient.get(url)
  },

  borrowBook(data: BookLoanDocument) {
    const url = `/bookloans`
    return axiosClient.post(url, data)
  },

  returnBook(bookloanId: string) {
    const url = `/bookloans/${bookloanId}`
    return axiosClient.delete(url)
  },
}

export default userApi
