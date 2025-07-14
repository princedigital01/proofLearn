"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface EnrolledCourse {
  id: string
  title: string
  instructor: string
  progress: number
  totalLessons: number
  completedLessons: number
  image?: string
}

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const res = await fetch("/api/enroll/me")
        const data = await res.json()
        if (res.ok) setEnrolledCourses(data.courses)
      } catch (err) {
        console.error("Failed to fetch enrolled courses", err)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrolled()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Continue Learning</h2>
        <Badge variant="secondary">{enrolledCourses.length} Active Courses</Badge>
      </div>

      <div className="flex flex-col md:grid grid-cols-2 gap-6 mt-6">
        {enrolledCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>by {course.instructor}</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">{course.progress}%</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={course.progress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                <span>{course.totalLessons - course.completedLessons} remaining</span>
              </div>
              <Link href={`/courses/${course.id}`}>
                <Button className="w-full">Continue Course</Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        <Link href={"/courses"}><Button> Add a course</Button></Link>
      </div>
    </>
  )
}

export default EnrolledCourses
