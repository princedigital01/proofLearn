import mongoose, { Schema, model, models, Document } from 'mongoose'

export interface IUser extends Document {
  id: number
  name?: string
  email: string
  password?: string
  image?: string
  wallet?: string
  role: 'user' | 'educator' | 'admin'
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: null, // only for credentials login
    },
    image: {
      type: String, // URL from GitHub/Google
      default: "image/profile.jpg",
    },
    wallet: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'educator', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
)

const User = models.User || model<IUser>('User', UserSchema)
export default User
