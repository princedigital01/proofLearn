import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import Counter from '@/models/Counter'
import { sendWelcomeEmail, sendNewUserEmail } from '@/lib/email'

console.log("done11")
interface CreateUserBody {
  email: string
  name?: string
  wallet?: string
  role?: 'user' | 'educator' | 'admin'
  pass: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("done12")

    // ✅ Validate body shape
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { email, name, wallet, role, pass } = body as CreateUserBody

    // ✅ Validate inputs
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (pass.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }
    console.log("done13")
    await connectDB()

    const exists = await User.findOne({ email })
    if (exists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }
    console.log("done14")

    const counter = await Counter.findByIdAndUpdate(
      { _id: 'userId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )

    const hashedPassword = await bcrypt.hash(pass, 10)

    const newUser = await User.create({
      id: counter.seq,
      email,
      name,
      wallet: wallet || null,
      role: role || 'user',
      password: hashedPassword,
    })
    console.log("done16")

    // ✅ Only send welcome email if account is successfully created
    const e1=await sendWelcomeEmail(email, name)
    
    if(e1.error){
      console.log(e1.error)
    }
    const e2 =await sendNewUserEmail(email)
    if(e2.error){
      console.log("error at e2")
    }

    return NextResponse.json({ success: true, user: newUser }, { status: 201 })

  } catch (err) {
    console.error('Create user error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
