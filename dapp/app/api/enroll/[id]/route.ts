import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Enrollment from '@/models/enroll/Enrollment'
import User from '@/models/user/User'
import { Types } from 'mongoose'

// GET method - Get enrollment using session email
export async function GET(req: NextRequest,  { params }: {params: Promise<{ id: string }>} ) {
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

    const {id} = await params
    const courseId=id;

    const enrollment = await Enrollment.findOne({
      courseId: new Types.ObjectId(courseId),
      userId: user._id,
    }).lean()

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    return NextResponse.json(enrollment, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT method - Enroll or update progress using session email
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
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

    const courseId = context.params.id
    const { progress, currentLessonId, completed } = await req.json()

    const updateData: any = {}
    if (typeof progress === 'number') updateData.progress = progress
    if (currentLessonId) updateData.currentLessonId = currentLessonId
    if (typeof completed === 'boolean') updateData.completed = completed
    if (completed) updateData.completedAt = new Date()

    const updated = await Enrollment.findOneAndUpdate(
      {
        userId: user._id,
        courseId: new Types.ObjectId(courseId),
      },
      {
        $setOnInsert: { enrolledAt: new Date() },
        $set: updateData,
      },
      {
        upsert: true,
        new: true,
      }
    )

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
