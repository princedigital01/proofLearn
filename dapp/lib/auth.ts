
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error('Email not found');
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error('Invalid password');
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = (user as any).name;
        token.email = user.email;
        token.role = (user as any).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as number,
        name: token.name as string,
        email: token.email as string,
        role: token.role as 'user' | 'educator' | 'admin',
      };
      return session;
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
};