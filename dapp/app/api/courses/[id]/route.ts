import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/course/Course'
import Lesson from '@/models/course/Lesson'
import Quiz from '@/models/course/Quiz'
import Question from '@/models/course/Question'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/user/User'

interface CourseDoc {
  _id: string
  title: string
  description: string
  category: string
  createdBy: String
  price?: number
  status?: 'draft' | 'published'
}
interface QuestionDoc {
  _id: string
  quizId: string
  type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank'
  text: string
  options: string[]
  correctAnswer: string | boolean
  explanation?: string
  order: number
}

interface QuizDoc {
  _id: string
  lessonId: string
  title: string
  questions: QuestionDoc[]
  passingScore?: number
  timeLimit?: number
  createdAt?: string
  updatedAt?: string
}


export async function GET(
  req: NextRequest,
  { params } // Let Next.js/TypeScript infer the types from the file path
) {
  const { id }: { id: string } = params; 
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    const course = await Course.findById(id).lean() as Partial<CourseDoc> | null
    if (!course || !course._id) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 }).lean()

    const populatedLessons = await Promise.all(
      lessons.map(async (lesson) => {
        if (lesson.type === 'quiz') {
          const quizDoc = await Quiz.findOne({ lessonId: lesson._id }).lean()  as Partial<QuizDoc> | null
          if (quizDoc) {
            const questions = await Question.find({ quizId: quizDoc._id }).sort({ order: 1 }).lean()
            return {
              ...lesson,
              quiz: {
                ...quizDoc,
                questions
              }
            }
          }
        }
        return lesson
      })
    )

    return NextResponse.json({ ...course, lessons: populatedLessons }, { status: 200 })

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params

  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()
    const { title, description, category, price, status, lessons } = body

    const course = await Course.findById(id)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (!course.createdBy || course.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden - You are not the course owner' }, { status: 403 })
    }

    if (!status) {
      course.title = title
      course.description = description
      course.category = category
      course.price = price
      course.status = 'draft'
      await course.save()

      await Lesson.deleteMany({ courseId: course._id })

      if (Array.isArray(lessons)) {
        for (const [index, lesson] of lessons.entries()) {
          const newLesson = await Lesson.create({
            courseId: course._id,
            title: lesson.title,
            type: lesson.type,
            order: index + 1,
            videoUrl: lesson.videoUrl,
          })

          if (lesson.type === 'quiz' && lesson.quiz?.questions?.length) {
            const quiz = await Quiz.create({
              lessonId: newLesson._id,
              title: lesson.quiz.title || lesson.title,
              passingScore: lesson.quiz.passingScore || 60,
              timeLimit: lesson.quiz.timeLimit || 0,
              questions: []
            })

            const questionIds = []
            for (const [qIndex, question] of lesson.quiz.questions.entries()) {
              const newQuestion = await Question.create({
                quizId: quiz._id,
                type: question.type,
                text: question.text,
                options: question.options,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                order: qIndex + 1
              })
              questionIds.push(newQuestion._id)
            }

            await Quiz.findByIdAndUpdate(quiz._id, { questions: questionIds })
          }
        }
      }
    } else {
      course.status = status || 'draft'
      await course.save()
    }

    return NextResponse.json({ success: true, courseId: course._id, status: course.status })

  } catch (err) {
    console.error('PUT course error: ', err)
    return NextResponse.json({ error: 'Server error ' }, { status: 500 })
  }
}
