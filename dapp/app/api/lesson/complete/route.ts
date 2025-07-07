import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Enrollment from '@/models/enroll/Enrollment'
import Lesson from '@/models/course/Lesson'
import Course from '@/models/course/Course'
import User from '@/models/user/User'
import { Types } from 'mongoose'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId, lessonId } = await req.json()

    if (!courseId || !lessonId) {
      return NextResponse.json({ error: 'Missing courseId or lessonId' }, { status: 400 })
    }

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const enrollment = await Enrollment.findOne({
      userId: user._id,
      courseId,
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'Not enrolled' }, { status: 403 })
    }

    const allLessons = await Lesson.find({ courseId }).sort({ order: 1 })
    const currentIndex = allLessons.findIndex(
      (l) => l._id.toString() === lessonId
    )

    if (currentIndex === -1) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }
const databaseId = allLessons.findIndex(
      (l) => l._id.toString() === enrollment.currentLessonId.toString()
    )
    console.log(databaseId)
    if (databaseId === -1) {
      return NextResponse.json({ error: 'database id not found' }, { status: 404 })
    }
    
    const nextLessonCheck = databaseId<=currentIndex ? allLessons[currentIndex + 1]: allLessons[databaseId+1]
    const nextLesson = allLessons[currentIndex + 1];

    if (nextLessonCheck) {
      enrollment.currentLessonId = nextLessonCheck._id
    } else {
      enrollment.completed = true
    }

    // Optional: update progress
    const completedCount = databaseId<=currentIndex ?currentIndex + 1: databaseId+1
    const totalLessons = allLessons.length
    const progress = Math.floor((completedCount / totalLessons) * 100)

    if(databaseId<=currentIndex) enrollment.progress = progress;

    await enrollment.save()

    return NextResponse.json({
      message: 'Lesson completed',
      nextLessonId: nextLesson?._id || null,
      progress,
      done: !nextLesson,
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
