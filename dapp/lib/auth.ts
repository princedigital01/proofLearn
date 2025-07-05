import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { NextAuthOptions } from 'next-auth'
import { connectDB } from '@/lib/mongodb'
import Counter from '@/models/Counter'
import User from '@/models/user/User' 
import bcrypt from 'bcryptjs'       

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
        if (!user.password) throw new Error('sorry wrong signin method');
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error('Invalid password');
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // ⬅ redirect all errors to your form
  },
  callbacks: {
      async signIn({ user, account, profile }) {
      // We only want to run this logic for OAuth providers (google, github)
      if (account?.provider === 'google' || account?.provider === 'github') {
        await connectDB();
        try {
          // Check if a user with this email already exists
          const existingUser = await User.findOne({ email: user.email });

          // If the user doesn't exist, create them
          if (!existingUser) {
            console.log("User not found, creating new user...");

            // Get the next auto-incrementing ID
            const counter = await Counter.findByIdAndUpdate(
              { _id: 'userId' },
              { $inc: { seq: 1 } },
              { upsert: true, new: true }
            );
            
            await User.create({
              id: counter.seq, 
              name: user.name,
              email: user.email,
              image: user.image, 
              role: 'user', 
            });
            console.log("New user created successfully.");
          }
          return true; 
        } catch (error) {
          console.error("Error during sign-in process:", error);
          return false; 
        }
      }
      
      
      return true; 
    },
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