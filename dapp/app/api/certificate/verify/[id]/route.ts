import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/enroll/Certificate'; 

// This function handles GET requests to /api/certificate/verify/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate the ID if it's a MongoDB ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ message: 'Invalid Certificate ID format' }, { status: 400 });
    }

    const certificate = await Certificate.findById(id).lean();

    if (!certificate) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    // The frontend expects the data inside a 'certificate' key
    return NextResponse.json({ certificate }, { status: 200 });

  } catch (error) {
    console.error('API Verify Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}