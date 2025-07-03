"use client"
import Header from "@/components/Header"
import { SessionProvider } from 'next-auth/react';


const layout = ({children,session}: { children: React.ReactNode,session:any }) => {
  return (
    <SessionProvider session={session}>
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
        {children}
    </div>
    </SessionProvider>
  )
}

export default layout