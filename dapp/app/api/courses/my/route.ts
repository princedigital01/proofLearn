import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/course/Course'
import User from '@/models/user/User'

export async function GET() {
  try {
    
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const courses = await Course.find({ createdBy: user._id }).sort({ createdAt: -1 }).lean()
    
    return NextResponse.json(courses, { status: 200 })

  } catch (err) {
    console.error('GET tutor courses error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
