'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CompleteBtn({
  courseId,
  lessonId,
  isLastLesson,
}: {
  courseId: string
  lessonId: string
  isLastLesson: boolean
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/lesson/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, lessonId }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to complete lesson')

      if (data.nextLessonId) {
        router.push(`/courses/${courseId}/lessons/${data.nextLessonId}`)
      } else {
        // Course finished
        router.push(`/certificate/${courseId}`) // or /my-courses
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
    >
      {loading ? 'Completing...' : isLastLesson ? 'Finish Course' : 'Mark Complete & Continue →'}
    </button>
  )
}
