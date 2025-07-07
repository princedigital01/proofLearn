import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/user/User'
import Lesson from '@/models/course/Lesson'
import Quiz from '@/models/course/Quiz'

export async function GET(req: Request, { params }: { params: { lessonId: string } }) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await User.findOne({ email: session.user.email }).lean()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const lesson = await Lesson.findById(params.lessonId).lean()
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const quiz = await Quiz.findOne({ lessonId: lesson._id })
      .populate('questions')
      .lean()

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found for this lesson' }, { status: 404 })
    }

    return NextResponse.json( quiz )
  } catch (err) {
    console.error('[QUIZ_FETCH_ERROR]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
