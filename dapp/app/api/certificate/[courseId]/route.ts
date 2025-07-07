import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Certificate from '@/models/enroll/Certificate'
import Course from '@/models/course/Course'
import User from '@/models/user/User'
import Enrollment from '@/models/enroll/Enrollment'
import { Types } from 'mongoose' // Import Mongoose Types

// --- STEP 1: Define explicit interfaces for your data models ---
// This tells TypeScript the exact shape of your objects.

interface IUser {
  _id: Types.ObjectId;
  email: string;
  name?: string; // `name` can be optional
}

interface ICourse {
  _id: Types.ObjectId;
  title: string;
}

interface IEnrollment {
  _id: Types.ObjectId;
  completed: boolean; // Assuming this is a boolean field in your schema
}

interface ICertificate {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  courseTitle: string;
  userName: string;
  issuedAt: Date;
  txHash: string;
  ipfsUrl: string;
}

// --- The API Route Handler ---
export async function GET(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const {courseId} = await params
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

    const course = await Course.findById(courseId).lean<ICourse>();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const enrollment = await Enrollment.findOne({ userId: user._id, courseId: courseId }).lean<IEnrollment>();

    // This check is now fully type-safe because TS knows `enrollment` can be null or an IEnrollment object.
    if (!enrollment?.completed) {
      return NextResponse.json({ error: 'You have not completed this course.' }, { status: 403 }); // 403 Forbidden is more appropriate
    }

    // Use `let` because this variable might be reassigned.
    let certificate = await Certificate.findOne({ userId: user._id, courseId: courseId }).lean<ICertificate>();

    // --- STEP 3: Handle the creation of a new certificate with correct types ---
    if (!certificate) {
      // Certificate.create() returns a full Mongoose Document, not a lean object.
      const newCertDocument = await Certificate.create({
        userId: user._id,
        courseId: courseId,
        courseTitle: course.title, // This is now safe to access
        userName: user.name || 'Anonymous', // This is also safe
        issuedAt: new Date(),
        txHash: "txHash", // Replace with actual hash generation
        ipfsUrl: "ipfsUrl", // Replace with actual IPFS URL
      });

      // Convert the Mongoose document to a plain object to be consistent and assign it.
      certificate = newCertDocument.toObject() as ICertificate;
    }

    return NextResponse.json({ certificate });

  } catch (err) {
    // It's good practice to type the error object
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('[CERTIFICATE_GET_ERROR]', errorMessage);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}