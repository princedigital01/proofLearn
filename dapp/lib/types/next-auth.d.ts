import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      email: string
      role: 'user' | 'educator' | 'admin'
      name?: string;
    }
  }

  interface User {
    id: number
    email: string
    role: 'user' | 'educator' | 'admin'
    name?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    email: string
    role: 'user' | 'educator' | 'admin'
    name?: string;
  }
}
