import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Certificate from '@/models/enroll/Certificate'
import Course from '@/models/course/Course'
import User from '@/models/user/User'

export async function GET() {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const certs = await Certificate.find({ userId: user._id }).sort({ issuedAt: -1 }).lean()

    const enriched = await Promise.all(
      certs.map(async (cert) => {
        const course = await Course.findById(cert.courseId).lean()
        return {
          ...cert,
          courseTitle: course?.title || 'Unknown Course',
          userName: user.name || 'Anonymous',
        }
      })
    )

    return NextResponse.json({ certificates: enriched })
  } catch (err) {
    console.error('[CERTIFICATE_LIST_ERROR]', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
