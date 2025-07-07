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

// --- STEP 1: Define explicit interfaces for your data models ---
interface IUser {
  _id: Types.ObjectId;
  email: string;
}

interface IQuestion {
  _id: Types.ObjectId;
  // `any` is a safe type for Mongoose's `Mixed` type.
  // It ensures we can call .toString() on it without a TS error.
  correctAnswer: any;
}

interface IQuiz {
  _id: Types.ObjectId;
  questions: IQuestion[]; // This represents the populated questions
  passingScore: number;
}

interface IEnrollment {
  _id: Types.ObjectId;
}

interface ILesson {
  _id: Types.ObjectId;
}

// Interface for the incoming request body
interface IRequestBody {
  courseId: string;
  lessonId: string;
  answers: Record<string, string | number | null>; // A dictionary of questionId: answer
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- STEP 2: Use the interfaces with Mongoose queries ---
    const user = await User.findOne({ email: session.user.email }).lean<IUser>();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Type the incoming request body for safety
    const { courseId, lessonId, answers }: IRequestBody = await req.json();

    if (!courseId || !lessonId || !answers) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Query is now fully typed, including the populated questions
    const quiz = await Quiz.findOne({ lessonId }).populate('questions').lean<IQuiz>();
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const gradedAnswers = [];

    // --- STEP 3: Make the grading logic more robust ---
    for (const question of quiz.questions) {
      const submittedAnswer = answers[question._id.toString()];
      const correctAnswer = question.correctAnswer;
      let isCorrect = false;

      // This robust check prevents errors if an answer is missing or if the correct answer is null/undefined.
      // It also prevents a bug where `null === null` could be true.
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

      // Ensure currentIndex is valid before proceeding
      if (currentIndex > -1) {
        const nextLesson = allLessons[currentIndex + 1];

        if (nextLesson) {
          // Advance to the next lesson
          await Enrollment.updateOne(
            { _id: enrollment._id },
            { $set: { currentLessonId: nextLesson._id } }
          );
        } else {
          // This was the last lesson, mark the course as complete
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