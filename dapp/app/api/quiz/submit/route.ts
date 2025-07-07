import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/user/User'
import Quiz from '@/models/course/Quiz'
import QuizAttempt from '@/models/course/QuizAttempt'
import Enrollment from '@/models/enroll/Enrollment'
import Lesson from '@/models/course/Lesson'
import { Types } from 'mongoose'

interface IUser {
  _id: Types.ObjectId;
  email: string;
}

interface IQuestion {
  _id: Types.ObjectId;
  correctAnswer: any;
}

interface IQuiz {
  _id: Types.ObjectId;
  questions: IQuestion[];
  passingScore: number;
}

interface IEnrollment {
  _id: Types.ObjectId;
}

interface ILesson {
  _id: Types.ObjectId;
}

interface IRequestBody {
  courseId: string;
  lessonId: string;
  answers: Record<string, string | number | null>;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).lean<IUser>();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { courseId, lessonId, answers }: IRequestBody = await req.json();

    if (!courseId || !lessonId || !answers) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const quiz = await Quiz.findOne({ lessonId }).populate('questions').lean<IQuiz>();
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const gradedAnswers = [];

    for (const question of quiz.questions) {
      const submittedAnswer = answers[question._id.toString()];
      const correctAnswer = question.correctAnswer;
      let isCorrect = false;

      if (submittedAnswer != null && correctAnswer != null) {
        isCorrect = submittedAnswer.toString().trim().toLowerCase() === correctAnswer.toString().trim().toLowerCase();
      }

      if (isCorrect) correctCount++;

      gradedAnswers.push({
        questionId: question._id,
        selectedAnswer: submittedAnswer,
        correct: isCorrect,
      });
    }

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= quiz.passingScore;

    await QuizAttempt.create({
      userId: user._id,
      quizId: quiz._id,
      score,
      passed,
      answers: gradedAnswers,
      completedAt: new Date(),
    });

    const enrollment = await Enrollment.findOne({ userId: user._id, courseId }).lean<IEnrollment>();

    if (passed && enrollment) {
      const allLessons = await Lesson.find({ courseId }).sort({ order: 1 }).lean<ILesson[]>();
      const currentIndex = allLessons.findIndex(l => l._id.toString() === lessonId);

      if (currentIndex > -1) {
        const nextLesson = allLessons[currentIndex + 1];

        if (nextLesson) {
          await Enrollment.updateOne(
            { _id: enrollment._id },
            { $set: { currentLessonId: nextLesson._id } }
          );
        } else {
          await Enrollment.updateOne(
            { _id: enrollment._id },
            { $set: { completed: true } }
          );
        }
      }
    }

    return NextResponse.json({
      message: 'Quiz submitted successfully!',
      score,
      passed,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('[QUIZ_SUBMIT_ERROR]', errorMessage);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}