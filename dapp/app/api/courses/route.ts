// app/api/courses/route.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/course/Course'
import Lesson from '@/models/course/Lesson'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    console.log("done1")
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
console.log("done2")
    const body = await req.json()
    const { title, description, category, price, lessons } = body

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
console.log("done3")
    await connectDB()
console.log("donex")
    const newCourse = await Course.create({
      title,
      description,
      category,
      price,
      //thumbnail,
      createdBy: session.user.id, // You can also look up full user by email if needed
      status: 'draft',
    })
console.log("done4")
    if (Array.isArray(lessons)) {
      for (const [index, lesson] of lessons.entries()) {
        await Lesson.create({
          courseId: newCourse._id,
          title: lesson.title,
          type: lesson.type,
          order: index + 1,
          videoUrl: lesson.videoUrl,
          quiz: lesson.quiz || [],
        })
      }
    }
console.log("done5")
    return NextResponse.json({ success: true, courseId: newCourse._id }, { status: 201 })
  } catch (err) {
    console.error('Create course error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
