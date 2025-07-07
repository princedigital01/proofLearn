import mongoose, { Types } from 'mongoose'
import { connectDB } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import User from "@/models/user/User"
import Enrollment from "@/models/enroll/Enrollment"
import Course from "@/models/course/Course"
import Lesson from "@/models/course/Lesson"
import { NextResponse } from "next/server"

// --- STEP 1: Define explicit interfaces for your data models ---

interface IUser {
  _id: Types.ObjectId;
  email: string;
  name?: string;
}

interface IEnrollment {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  currentLessonId?: Types.ObjectId;
}

interface ICourse {
  _id: Types.ObjectId;
  title?: string;
  createdBy: Types.ObjectId; // Assuming every course has a creator
  image?: string;
}

interface ILesson {
  _id: Types.ObjectId;
}


export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- STEP 2: Use the interfaces with Mongoose queries ---
    const user = await User.findOne({ email: session.user.email }).lean<IUser>();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const enrollments = await Enrollment.find({ userId: user._id }).lean<IEnrollment[]>();

    // Helper function is now safer with a typed query
    const getName = async (createdBy: Types.ObjectId): Promise<string> => {
      try {
        const educator = await User.findById(createdBy).lean<IUser>();
        return educator?.name ?? 'Unknown Educator';
      } catch (error) {
        console.error('Failed to fetch user name:', error);
        return 'Unknown Educator';
      }
    };

    const courseDataPromises = enrollments.map(async (enroll) => {
      const course = await Course.findById(enroll.courseId).lean<ICourse>();

      // --- STEP 3: Add a crucial null check to prevent crashes ---
      if (!course) {
        // This enrollment is for a deleted course, so we skip it.
        return null;
      }

      const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 }).lean<ILesson[]>();
      const totalLessons = lessons.length;
      
      const completedIndex = enroll.currentLessonId
        ? lessons.findIndex((l) => l._id.toString() === enroll.currentLessonId!.toString())
        : -1;

      const tutorName = await getName(course.createdBy);

      return {
        id: course._id.toString(),
        title: course.title || "Untitled Course",
        instructor: tutorName,
        progress: totalLessons > 0 ? Math.round(((completedIndex + 1) / totalLessons) * 100) : 0,
        totalLessons,
        completedLessons: completedIndex + 1,
        image: course.image || "/placeholder.svg?height=200&width=300"
      };
    });
    
    // Resolve all promises and filter out any null results from deleted courses
    const courseData = (await Promise.all(courseDataPromises)).filter(Boolean);

    return NextResponse.json({ courses: courseData });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error("[ENROLL_FETCH_ERROR]", errorMessage);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}