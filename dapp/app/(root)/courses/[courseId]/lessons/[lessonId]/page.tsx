import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import Quiz from "@/models/course/Quiz"
import Course from "@/models/course/Course"
import Lesson from "@/models/course/Lesson"
import Enrollment from "@/models/enroll/Enrollment"
import User from "@/models/user/User"
import QuizAttempt from "@/models/course/QuizAttempt"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import CompleteBtn from '@/components/lesson/CompleteBtn'

interface Props {
  params: { courseId: string; lessonId: string }
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = params

  await connectDB()

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return redirect("/login")

  const user = await User.findOne({ email: session.user.email }).lean()
  if (!user) return redirect("/login")

  const course = await Course.findById(courseId).lean()
  const lesson = await Lesson.findById(lessonId).lean()

  if (!course || !lesson || lesson.courseId.toString() !== courseId) return notFound()

  const enrollment = await Enrollment.findOne({
    userId: user._id,
    courseId,
  }).lean()

  if (!enrollment) return redirect(`/enroll/${courseId}`)

  const allLessons = await Lesson.find({ courseId }).sort({ order: 1 }).lean()

  const currentIndex = allLessons.findIndex(
    (l) => l._id.toString() === lessonId
  )

  if (currentIndex === -1) return notFound()

  if (!enrollment.currentLessonId && allLessons.length > 0) {
    await Enrollment.updateOne(
      { _id: enrollment._id },
      { $set: { currentLessonId: allLessons[0]._id } }
    )
    enrollment.currentLessonId = allLessons[0]._id
  }

  const allowedIndex = allLessons.findIndex(
    (l) => l._id.toString() === enrollment.currentLessonId?.toString()
  )

  const isUnlocked = currentIndex <= allowedIndex
  const nextLesson = allLessons[currentIndex + 1]

  let quiz = null
  let attempts: any[] = []
  const attemptLimit = 3

  if (lesson.type === 'quiz') {
    quiz = await Quiz.findOne({ lessonId }).populate('questions').lean()

    if (quiz) {
      attempts = await QuizAttempt.find({
        userId: user._id,
        quizId: quiz._id
      }).sort({ createdAt: -1 }).lean()
    }
  }

  if (!isUnlocked) {
    return (
      <div className="p-6 text-center text-red-600">
        This lesson is locked. Please complete the previous lessons first.
        <Link href={`/courses/${courseId}`} className="text-blue-600 block">
          return to course page
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
      <Link href={`/courses/${courseId}`} className="bg-gray-600 p-3 text-white font-semibold">
        return to course folder
      </Link>

      {lesson.videoUrl && (
        <video controls className="w-full mb-6 rounded" src={lesson.videoUrl} />
      )}

      {lesson.content && (
        <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: lesson.content }} />
      )}

      {/* Quiz Attempts */}
      {attempts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Your Quiz Attempts</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {attempts.map((a, i) => (
              <li key={i}>
                Attempt {attempts.length - i}: {a.score}% - {a.passed ? '✅ Passed' : '❌ Failed'} — {new Date(a.completedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {lesson.type === 'quiz' && quiz && (
        <div className="mt-4">
          {attempts.length < attemptLimit ? (
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}/quiz`}
              className="inline-block bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Take Quiz
            </Link>
          ) : (
            <p className="text-red-600">You’ve reached the max attempt limit ({attemptLimit}).</p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        {currentIndex > 0 && (
          <Link
            href={`/courses/${courseId}/lessons/${allLessons[currentIndex - 1]._id}`}
            className="text-blue-600 hover:underline"
          >
            ← Previous Lesson
          </Link>
        )}

        <CompleteBtn
          courseId={courseId}
          lessonId={lessonId}
          isLastLesson={!nextLesson}
        />
      </div>
    </div>
  )
}
