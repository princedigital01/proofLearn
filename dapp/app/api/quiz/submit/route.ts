import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/user/User'
import Quiz from '@/models/course/Quiz'
import Question from '@/models/course/Question'
import QuizAttempt from '@/models/course/QuizAttempt'
import Enrollment from '@/models/enroll/Enrollment'
import Lesson from '@/models/course/Lesson'

export async function POST(req: Request) {
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

    const body = await req.json()
    const { courseId, lessonId, answers } = body

    if (!courseId || !lessonId || !answers) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const quiz = await Quiz.findOne({ lessonId }).populate('questions').lean()
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    let correctCount = 0
    const totalQuestions = quiz.questions.length
    const gradedAnswers = []

    for (const question of quiz.questions) {
      const submitted = answers[question._id.toString()]
      const isCorrect = submitted?.toString().trim().toLowerCase() === question.correctAnswer?.toString().trim().toLowerCase()

      if (isCorrect) correctCount++

      gradedAnswers.push({
        questionId: question._id,
        selectedAnswer: submitted,
        correct: isCorrect,
      })
    }

    const score = Math.round((correctCount / totalQuestions) * 100)
    const passed = score >= quiz.passingScore

    await QuizAttempt.create({
      userId: user._id,
      quizId: quiz._id,
      score,
      passed,
      answers: gradedAnswers,
      completedAt: new Date(),
    })

    const enrollment = await Enrollment.findOne({ userId: user._id, courseId })

    if (passed && enrollment) {
      const allLessons = await Lesson.find({ courseId }).sort({ order: 1 }).lean()
      const currentIndex = allLessons.findIndex(l => l._id.toString() === lessonId)

      const nextLesson = allLessons[currentIndex + 1]

      if (nextLesson) {
        await Enrollment.updateOne(
          { _id: enrollment._id },
          { $set: { currentLessonId: nextLesson._id } }
        )
      } else {
        await Enrollment.updateOne(
          { _id: enrollment._id },
          { $set: { completed: true } }
        )
      }
    }

    return NextResponse.json({
      message: 'Quiz submitted',
      score,
      passed,
    })
  } catch (err) {
    console.error('[QUIZ_SUBMIT_ERROR]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
