import React from 'react'
import LoginPage from "@/components/LoginPage"
import Header from '@/components/Header'

const page = () => {
  return (
    <div className='w-screen h-screen'>
      <Header title={"Signup"}>{""}</Header>
      <LoginPage/>
    </div>
      
    
  )
}

export default page