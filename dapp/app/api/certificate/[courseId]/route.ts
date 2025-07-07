import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Certificate from '@/models/enroll/Certificate'
import Course from '@/models/course/Course'
import User from '@/models/user/User'
import Enrollment from '@/models/enroll/Enrollment'

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await User.findOne({ email: session.user.email }).lean()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const course = await Course.findById(params.courseId).lean()
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    let certificate = await Certificate.findOne({ userId: user._id, courseId: params.courseId }).lean()
    let enrollment = await Enrollment.findOne({ userId: user._id, courseId: params.courseId }).lean()

    if(!enrollment?.completed) return NextResponse.json({ error: 'you have not finished this course' }, { status: 500 })
    if (!certificate) {
    
        
      const newCert = await Certificate.create({
        userId: user._id,
        courseId: params.courseId,
        courseTitle: course.title,
        userName: user.name || 'Anonymous',
        issuedAt: new Date(),
        txHash: "txHash",
        ipfsUrl: "ipfsUrl",
      })

      certificate = newCert.toObject()
    }

    return NextResponse.json({ certificate })
  } catch (err) {
    console.error('[CERTIFICATE_GET_ERROR]', err)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
