/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type BookLoanDocument = Document & {
  userId: string;
  bookId: string;
};

const bookLoanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
})

export default mongoose.model<BookLoanDocument>('BookLoan', bookLoanSchema)
