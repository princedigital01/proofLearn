import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      email: string
      role: 'user' | 'educator' | 'admin'
    }
  }

  interface User {
    id: number
    email: string
    role: 'user' | 'educator' | 'admin'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    email: string
    role: 'user' | 'educator' | 'admin'
  }
}
