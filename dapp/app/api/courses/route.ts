import mongoose, { Types } from 'mongoose'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/course/Course'
import User from '@/models/user/User'

export async function GET() {
  try {
    await connectDB()

    const courses = await Course.find().sort({ createdAt: -1 }).lean()

    // Helper to get educator name
    const getName = async (createdBy: string | Types.ObjectId): Promise<string> => {
      try {
        const user = await User.findById(createdBy).lean() as { name?: string } | null
        return user?.name ?? 'Unknown Educator'
      } catch (error) {
        console.error('Failed to fetch user name:', error)
        return 'Unknown Educator'
      }
    }

    // Use Promise.all to resolve async getName calls
    const safeCourses = await Promise.all(
      courses.map(async (course) => {
        const tutorName = await getName(course.createdBy)
        return {
          _id: course._id,
          title: course.title || 'Untitled',
          description: course.description || 'No description provided.',
          category: course.category || 'General',
          price: course.price ?? 0,
          rating: course.rating ?? 4.5,
          students: course.students ?? 12,
          duration: course.duration || '1 hour',
          instructor: tutorName,
          level: course.level || 'Beginner',
          image: course.image || '/placeholder.svg?height=200&width=300',
        }
      })
    )

    return NextResponse.json(safeCourses, { status: 200 })
  } catch (err) {
    console.error("GET all courses error:", err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
