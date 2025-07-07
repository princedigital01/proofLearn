import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/user/User'
import Lesson from '@/models/course/Lesson'
import Quiz from '@/models/course/Quiz'
import { Types } from 'mongoose'


interface IUser {
  _id: Types.ObjectId;
  email: string;
}

interface ILesson {
  _id: Types.ObjectId;
}

// This interface should match the structure of your Question schema
interface IQuestion {
  _id: Types.ObjectId;
  text: string;
  options: string[];
  correctAnswer: any; // Use `any` for Mongoose's `Mixed` type, or a more specific union type
  // Add any other question fields here
}

// This interface describes a Quiz with its questions populated
interface IQuiz {
  _id: Types.ObjectId;
  lessonId: Types.ObjectId;
  title: string;
  questions: IQuestion[]; // The populated field is now an array of IQuestion objects
  passingScore: number;
  timeLimit?: number;
}


export async function GET(req: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const {lessonId} = await params;
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- STEP 2: Use the interfaces with Mongoose's .lean() method ---
    const user = await User.findOne({ email: session.user.email }).lean<IUser>();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const lesson = await Lesson.findById(lessonId).lean<ILesson>();
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // This query is now fully typed. TypeScript knows that if it succeeds,
    // the result will match the IQuiz interface.
    const quiz = await Quiz.findOne({ lessonId: lesson._id })
      .populate('questions') // Populates the questions field
      .lean<IQuiz>(); // Casts the final lean object to our IQuiz type

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found for this lesson' }, { status: 404 });
    }
    
    // The returned quiz object is now fully type-safe.
    return NextResponse.json(quiz);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('[QUIZ_FETCH_ERROR]', errorMessage, { lessonId });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
