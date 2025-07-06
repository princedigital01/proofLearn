// app/api/courses/route.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/course/Course'
import Lesson from '@/models/course/Lesson'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/user/User' 

export async function POST(req: Request) {
  try {
    
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, category, price, lessons } = body

    const user = await User.findOne({ email: session.user.email })
if (!user) {
  return NextResponse.json({ error: 'User not found' }, { status: 404 })
}
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    await connectDB()
    console.log(session.user.id)
    const newCourse = await Course.create({
      title,
      description,
      category,
      price,
      createdBy:  user._id, 
      status: 'draft',
    })

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
    console.log( err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
