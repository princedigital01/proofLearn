import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Certificate from '@/models/enroll/Certificate'
import Course from '@/models/course/Course'
import User from '@/models/user/User'
import { Types } from 'mongoose' // Import Mongoose Types


interface IUser {
  _id: Types.ObjectId;
  email: string;
  name?: string;
}

interface ICertificate {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  // Add other certificate fields if needed for the response
}

interface ICourse {
  _id: Types.ObjectId;
  title: string;
}

// --- The API Route Handler ---
export async function GET() {
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

    // This now returns a strongly-typed array of certificates.
    const certs = await Certificate.find({ userId: user._id })
      .sort({ issuedAt: -1 })
      .lean<ICertificate[]>();

    const enriched = await Promise.all(
      // TypeScript now knows `cert` is of type `ICertificate`.
      certs.map(async (cert) => {
        // This query is now typed, so TypeScript knows `course` is `ICourse | null`.
        const course = await Course.findById(cert.courseId).lean<ICourse>();
        
        // Accessing `course.title` and `user.name` is now safe and error-free.
        return {
          ...cert,
          courseTitle: course?.title || 'Unknown Course',
          userName: user.name || 'Anonymous',
        };
      })
    );

    return NextResponse.json({ certificates: enriched });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('[CERTIFICATE_LIST_ERROR]', errorMessage);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}