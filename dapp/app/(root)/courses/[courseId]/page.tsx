import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/course/Course";
import Lesson from "@/models/course/Lesson";
import Enrollment from "@/models/enroll/Enrollment";
import User from "@/models/user/User";
import Link from "next/link";
import Header from "@/components/Header";
import { Types } from "mongoose"; // Import Mongoose Types

// --- STEP 1: Define explicit types for your data ---
// This is the most important step. It tells TypeScript the shape of your objects.
interface IUser {
  _id: Types.ObjectId;
  email: string;
}

interface ICourse {
  _id: Types.ObjectId;
  title: string;
  description: string;
}

interface ILesson {
  _id: Types.ObjectId;
  title: string;
  order: number;
}

interface IEnrollment {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  currentLessonId?: Types.ObjectId;
  progress: number;
}

// --- STEP 2: Correctly type the Page Props ---
// Renamed to 'CoursePageProps' to be specific and avoid any potential conflicts.
type CoursePageProps = {
  params: Promise<{ courseId: string }>;
};

import { Metadata } from 'next'
// import Course from '@/models/course/Course'
// import { connectDB } from '@/lib/mongodb'

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { courseId } = await params;

  await connectDB();

  const course = await Course.findById(courseId).lean<ICourse>()

  if (!course) return {}

  return {
    title: `${course.title} | ProofLearn`,
    description: course.description || 'Explore this course on ProofLearn.',
    openGraph: {
      title: course.title,
      description: course.description,
      url: `https://proof-learn-e.vercel.app/courses/${courseId}`,
      type: 'website',
    }
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  await connectDB();
const{courseId} = await params
  const session = await getServerSession(authOptions);

  // --- STEP 3: Use the types with Mongoose's .lean() ---
  const course = await Course.findById(courseId).lean<ICourse>();
  
  // This check now correctly informs TypeScript that `course` is not null below this line.
  if (!course) {
    return notFound();
  }

  let enrollment: IEnrollment | null = null;
  let progress = 0;

  if (session?.user?.email) {
    const user = await User.findOne({ email: session.user.email }).lean<IUser>();
    if (user) {
      enrollment = await Enrollment.findOne({
        userId: user._id,
        courseId: course._id,
      }).lean<IEnrollment>();

      // Now TS knows `enrollment` is either `IEnrollment` or `null`
      if (enrollment) {
        progress = enrollment.progress;
      }
    }
  }

  const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 }).lean<ILesson[]>();

  const currentLessonId = enrollment?.currentLessonId?.toString() ?? null;

  const currentIndex = currentLessonId 
    ? lessons.findIndex((lesson) => lesson._id.toString() === currentLessonId)
    : -1; // If no current lesson, set index to -1
  
  // Logic to find the next lesson to continue to
  // If completed, link to first lesson. If in progress, link to current.
  const nextLessonId = lessons[currentIndex > -1 ? currentIndex : 0]?._id.toString();

  return (
    <>
      {/* A self-closing tag is cleaner if there are no children */}
      <Header title="learn" >{""}</Header>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
        <pre className="whitespace-pre-wrap">{course.description}</pre>

        {enrollment ? (
          <>
            <div className="mb-4 text-green-700 font-medium">You are enrolled!</div>
            <div className="mb-6">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm mt-1 text-gray-600">{progress}% complete</p>
            </div>
            {nextLessonId ? (
              <Link
                href={`/courses/${course._id.toString()}/lessons/${nextLessonId}`}
                className="inline-block mb-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
              >
                {progress === 0 ? "Start Course" : "Continue Learning"}
              </Link>
            ) : (
               <p className="text-gray-600 mb-6">This course has no lessons yet.</p>
            )}
          </>
        ) : (
          <div className="mb-6 text-red-500">
            You are not enrolled in this course.
            <Link
              href={`/enroll/${course._id.toString()}`}
              className="ml-3 text-blue-600 underline"
            >
              Enroll now
            </Link>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-3">Lessons</h2>
        <ul className="space-y-3">
          {lessons.map((lesson, index) => {
            // Unlocked if they are enrolled and the lesson index is at or before their current lesson
            const isUnlocked = enrollment && index <= (currentIndex > -1 ? currentIndex : -1);
            // The very first lesson is also available to enrolled users
            const isFirstLesson = index === 0 && enrollment;

            return (
              <li key={lesson._id.toString()}>
                {isUnlocked || isFirstLesson ? (
                  <Link
                    href={`/courses/${course._id.toString()}/lessons/${lesson._id.toString()}`}
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
                    <h3 className="font-medium text-gray-500">
                      <span className="mr-2">🔒</span>
                      {index + 1}. {lesson.title}
                    </h3>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  );
}