/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type AuthorDocument = Document & {
  firstName: string
  lastName: string
  bookId: string[]
}

const authorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    index: true,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  bookId: [{ type: mongoose.Types.ObjectId, ref: 'Book' }],
})

export default mongoose.model<AuthorDocument>('Author', authorSchema)
