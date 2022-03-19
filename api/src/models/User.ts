/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Date, Document } from 'mongoose'

export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  loanBook: {
    bookId: string
    dayBorrow: Date
    dayReturn: Date
  }[]
}

const bookSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  loanBook: [
    {
      bookId: { type: mongoose.Types.ObjectId, ref: 'Book' },
      dayBorrow: Date,
      dayReturn: Date,
    },
  ],
})

export default mongoose.model<UserDocument>('User', bookSchema)
