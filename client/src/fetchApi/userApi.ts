import axiosClient from './axiosClient'
import { UserDocument } from '../types'

const userApi = {
  getAllUsers() {
    const url = `/users`
    return axiosClient.get(url)
  },

  getOneUser(userId: string) {
    const url = `/users/${userId}`
    return axiosClient.get(url)
  },

  createUser(data: UserDocument) {
    const url = `/users`
    return axiosClient.post(url, data)
  },

  updateUser(userId: string, data: UserDocument) {
    const url = `/users/${userId}`
    return axiosClient.put(url, data)
  },

  deleteUser(userId: string) {
    const url = `/users/${userId}`
    return axiosClient.delete(url)
  },
}

export default userApi
