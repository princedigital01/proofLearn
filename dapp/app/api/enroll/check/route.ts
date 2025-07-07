import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Enrollment from '@/models/enroll/Enrollment'
import User from '@/models/user/User'
import { Types } from 'mongoose'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { courseId } = await req.json()

    if (!courseId || !Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: 'Invalid courseId' }, { status: 400 })
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      userId: user._id,
      courseId: new Types.ObjectId(courseId),
    })

    if (existing) {
      return NextResponse.json({ enrolled: true }, { status: 200 })
    }
    return NextResponse.json({ enrolled: false }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
