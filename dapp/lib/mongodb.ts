import mongoose from 'mongoose'

const MONGODB_URL = process.env.MONGO_CONN_STR as string

if (!MONGODB_URL) throw new Error("Database connection string missing (MONGO_CONN_STR)")

let cached = (global as any).mongoose || { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn 

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: 'proofLearn',
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
