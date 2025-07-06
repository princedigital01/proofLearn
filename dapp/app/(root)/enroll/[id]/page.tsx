"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Loading from "@/app/loading"

export default function EnrollPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load course")
        setCourse(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCourse()
  }, [id])

  const handleEnroll = async () => {
    try {
      const res = await fetch(`/api/enroll/${id}`, {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Enrollment failed")

      alert("Successfully enrolled!")
      router.push("/dashboard") // or /my-courses
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (status === "loading" || loading) return <Loading />

  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-700 mb-2">{course.description}</p>
      <p className="text-sm text-gray-500 mb-6">Category: {course.category}</p>
      <p className="text-lg font-semibold mb-6">Price: ${course.price || 0}</p>

      <button
        onClick={handleEnroll}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Enroll Now
      </button>
    </div>
  )
}
