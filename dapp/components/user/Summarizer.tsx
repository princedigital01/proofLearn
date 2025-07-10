"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'

const Summarizer = () => {
    const [active, setActive] = useState(false);

    const toggle= ()=>{
        if(active)setActive(false)
        else setActive(true)
    }
  return (
    <div className='hidden'>
        <div className={`${active ? "flex" : "hidden"} bg-slate-200 w-60 h-80 fixed right-[15%] bottom-28 `}>
            hi there
        </div>
        <Button className='fixed left-[85%] bottom-28 ' onClick={toggle}>Ai</Button>

    </div>
  )
}

export default Summarizer