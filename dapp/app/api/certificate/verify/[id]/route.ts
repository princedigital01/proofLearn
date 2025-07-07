import { NextResponse } from 'next/server';
import mongoose from 'mongoose'; // Import mongoose to check for ObjectID validity
import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/enroll/Certificate';

// This function handles GET requests to /api/certificate/verify/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id: identifier } = params; // Rename 'id' to 'identifier' for clarity

    if (!identifier) {
      return NextResponse.json({ message: 'Certificate identifier is required' }, { status: 400 });
    }

    // Prepare the query object
    let query;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = {
        $or: [
          { _id: new mongoose.Types.ObjectId(identifier) },
          { txHash: identifier },
        ],
      };
    } else {
      query = { txHash: identifier };
    }

     const certificate = await Certificate.findOne(query).lean();

    if (!certificate) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }
    
    // The frontend expects the data inside a 'certificate' key
    return NextResponse.json({ certificate }, { status: 200 });

  } catch (error) {
    console.error('API Verify Error:', error);
    // Be careful not to leak database error details to the client
    if (error instanceof mongoose.Error.CastError) {
        return NextResponse.json({ message: 'Invalid identifier format provided' }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}