import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/user/User'
import { isValidObjectId } from 'mongoose'

// Define the shape of the object we expect from the lean query
interface LeanUser {
  name: string;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()

  const { id } = params

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  try {
    // FIX: Provide a generic type to .lean() to tell TypeScript the shape of the object
    const user = await User.findById(id)
      .select('name')
      .lean<LeanUser>() // or .lean<{ name: string }>()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Now, TypeScript knows that `user` is an object with a `name` property
    return NextResponse.json({ name: user.name })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}