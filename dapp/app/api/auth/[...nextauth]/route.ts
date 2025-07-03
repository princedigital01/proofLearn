import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB()
        const user = await User.findOne({ email: credentials?.email })

        if (!user) throw new Error('User not found')
        // For demo only — implement bcrypt compare here
        return user
      },
    }),
  ],

  pages: {
    error: '/auth/error', // Custom error page route
    signIn: '/login',      // Optional: your custom login page
  },

  callbacks: {

     async redirect({ url, baseUrl }) {
      return '/dashboard' // 👈 default for all logins
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.email = user.email
        token.role = (user as any).role || 'user'
      }
      return token
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as number,
        email: token.email as string,
        role: token.role as 'user' | 'educator' | 'admin',
      }
      return session
    },
  },

  events: {
    async createUser({ user }) {
      await connectDB()
      const existing = await User.findOne({ email: user.email })
      if (existing && !existing.id) {
        const Counter = (await import('@/models/Counter')).default
        const counter = await Counter.findByIdAndUpdate(
          { _id: 'userId' },
          { $inc: { seq: 1 } },
          { upsert: true, new: true }
        )
        existing.id = counter.seq
        await existing.save()
      }
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET!,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
