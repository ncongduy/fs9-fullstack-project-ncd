/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type BookDocument = Document & {
  title: string
  publishedYear: number
  page: number
  rating: number
  author: string
  image: string
}

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      index: true,
      required: true,
    },
    publishedYear: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
      min: 1,
    },
    rating: {
      type: Number,
      min: 0,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<BookDocument>('Book', bookSchema)
