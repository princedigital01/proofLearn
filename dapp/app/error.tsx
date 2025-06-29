// app/error.tsx
'use client'

import Image from 'next/image';
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('App crashed:', error)
  }, [error])

  return (
    <div className="flex h-screen items-center justify-center bg-red-100 text-red-700">
      <div className="text-center space-y-4">
        <Image
          height={200}
          width={200}
          alt={'logo'}
          src={"/logo.svg"}

        />
        <h2 className="text-2xl font-bold">Oops! Something went wrong.</h2>
        <p>{error.message}</p>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
