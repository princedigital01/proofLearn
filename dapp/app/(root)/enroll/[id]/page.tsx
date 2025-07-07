"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Loading from "@/app/loading"
import Header from "@/components/Header"
import { WalletConnection } from "@/components/WalletConnection";
import { TokenBalance } from "@/components/TokenBalance";
import Link from "next/link"

export default function EnrollPage() {
  const { id } = useParams() // courseId
  const router = useRouter()
  const { data: session, status } = useSession()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [text, setText] = useState("Enroll")

  // Fetch course + enrollment status
  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      try {
        const [courseRes, enrollRes] = await Promise.all([
          fetch(`/api/courses/${id}`),
          fetch("/api/enroll/check", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseId: id }),
          }),
        ])

        const courseData = await courseRes.json()
        const enrollData = await enrollRes.json()

        if (!courseRes.ok) throw new Error(courseData.error || "Failed to load course")
        if (!enrollRes.ok) throw new Error(enrollData.error || "Failed to check enrollment")

        setCourse(courseData)
        console.log(enrollData)
        setIsEnrolled(enrollData.enrolled)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCourseAndEnrollment()
  }, [id])

  useEffect(()=>{
    if(isEnrolled)setError("you have alredy registered this course")
  },[isEnrolled])

  const handleEnroll = async () => {
    try {
      setText("Enroll")
      const res = await fetch("/api/enroll/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Enrollment failed")

      setText("Success loading...")
      router.push(`/courses/${id}`) // or /my-courses
    } catch (err: any) {
      setText("Enroll")
      alert(err.message)
    }
  }

  if (status === "loading" || loading) return <Loading />

  

  return (
    <>
      <Header title={"eroll"}>
        <div className="m-3 flex flex-col lg:flex-row items-center gap-2 ">
          <TokenBalance />
          <WalletConnection />
        </div>
      </Header>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-700 mb-2">{course.description}</p>
        <p className="text-sm text-gray-500 mb-6">Category: {course.category}</p>
        <p className="text-lg font-semibold mb-6">Price: ${course.price || 0}</p>

        {error ?(<p className="text-red-500 mb-4">{error}</p>):("")}

        {!isEnrolled ? (
          <button
            onClick={handleEnroll}
            disabled={isEnrolled}
            className={`m-3 px-6 py-2 rounded text-white transition ${isEnrolled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isEnrolled ? "Already Enrolled" : text}
          </button>
        ) : (
          <Link
            href={`/courses/${id}`}
            className={`m-3 px-6 py-2 rounded text-white transition bg-blue-600 hover:bg-blue-700`}
          >
            continue Learning
          </Link>
        )
        }
        <div>user can pay using wallet</div>
      </div>
    </>
  )
}
