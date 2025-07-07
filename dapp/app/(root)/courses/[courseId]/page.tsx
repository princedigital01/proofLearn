import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import Course from "@/models/course/Course"
import Lesson from "@/models/course/Lesson"
import Enrollment from "@/models/enroll/Enrollment"
import User from "@/models/user/User"
import Link from "next/link"
import Header from "@/components/Header"

interface Props {
  params: { courseId: string }
}

export default async function CoursePage({ params }: Props) {
  await connectDB()

  const session = await getServerSession(authOptions)

  const course = await Course.findById(params.courseId).lean()
  if (!course) return notFound()

  let enrollment = null
  let currentLessonId: string | null = null
  let progress = 0

  if (session?.user?.email) {
    const user = await User.findOne({ email: session.user.email }).lean()
    if (user) {
      enrollment = await Enrollment.findOne({
        userId: user._id,
        courseId: course._id,
      }).lean()

      currentLessonId = enrollment?.currentLessonId?.toString() ?? null
      progress = enrollment?.progress ?? 0
    }
  }

  const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 }).lean()

  const currentIndex = lessons.findIndex(
    (lesson) => lesson._id.toString() === currentLessonId
  )

  const nextLessonId = lessons?.[currentIndex >= 0 ? currentIndex : 0]?._id.toString()

  return (
    <>
    <Header title="learn">{""}</Header>
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-700 mb-4">{course.description}</p>

      {enrollment ? (
        <>

          <div className="mb-4 text-green-700 font-medium">You are enrolled!</div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm mt-1 text-gray-600">{progress}% complete</p>
          </div>

          {/* Start or Continue Button */}
          {nextLessonId && (
            <Link
              href={`/courses/${course._id}/lessons/${nextLessonId}`}
              className="inline-block mb-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
            >
              {progress === 0 ? "Start from Beginning" : "Continue Learning"}
            </Link>
          )}
        </>
      ) : (
        <div className="mb-6 text-red-500">
          You are not enrolled in this course.
          <Link
            href={`/enroll/${course._id}`}
            className="ml-3 text-blue-600 underline"
          >
            Enroll now
          </Link>
        </div>
      )}

      {/* Lessons */}
      <h2 className="text-2xl font-semibold mb-3">Lessons</h2>
      <ul className="space-y-3">
        {lessons.map((lesson, index) => {
          const isUnlocked =
            !enrollment || index <= (currentIndex >= 0 ? currentIndex : 0)
          return (
            <li key={lesson._id}>
              {isUnlocked ? (
                <Link
                  href={`/courses/${course._id}/lessons/${lesson._id}`}
                  className={`block border rounded p-4 hover:bg-gray-100 transition ${
                    lesson._id.toString() === currentLessonId
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <h3 className="font-medium">
                    {index + 1}. {lesson.title}
                  </h3>
                </Link>
              ) : (
                <div className="block border border-gray-200 bg-gray-100 p-4 rounded opacity-60 cursor-not-allowed">
                  <h3 className="font-medium">
                    {index + 1}. {lesson.title} (Locked)
                  </h3>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>

    </>
  )
}
