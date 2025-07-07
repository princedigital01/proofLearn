// app/api/enroll/me/route.ts
import mongoose, { Types } from 'mongoose'
import { connectDB } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import User from "@/models/user/User"
import Enrollment from "@/models/enroll/Enrollment"
import Course from "@/models/course/Course"
import Lesson from "@/models/course/Lesson"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findOne({ email: session.user.email }).lean()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const enrollments = await Enrollment.find({ userId: user._id }).lean()

     const getName = async (createdBy: string | Types.ObjectId): Promise<string> => {
          try {
            const user = await User.findById(createdBy).lean() as { name?: string } | null
            return user?.name ?? 'Unknown Educator'
          } catch (error) {
            console.error('Failed to fetch user name:', error)
            return 'Unknown Educator'
          }
        }

    const courseData = await Promise.all(
      enrollments.map(async (enroll) => {
        const course = await Course.findById(enroll.courseId).lean()
        const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 }).lean()
        const totalLessons = lessons.length
        const completedIndex = lessons.findIndex((l) => l._id.toString() === enroll.currentLessonId?.toString())
        const tutorName = await getName(course.createdBy)
        return {
          id: course._id.toString(),
          title: course.title || "Untitled Course",
          instructor: tutorName || "Unknown",
          progress: totalLessons > 0 ? Math.round(((completedIndex + 1) / totalLessons) * 100) : 0,
          totalLessons,
          completedLessons: completedIndex + 1,
          image: course.image || "/placeholder.svg?height=200&width=300"
        }
      })
    )

    return NextResponse.json({ courses: courseData })
  } catch (error) {
    console.error("[ENROLL_FETCH_ERROR]", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
