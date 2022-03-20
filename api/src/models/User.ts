/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Date, Document } from 'mongoose'

export type UserDocument = Document & {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  address: string;
};

const userSchema = new mongoose.Schema({
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
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
})

export default mongoose.model<UserDocument>('User', userSchema)
