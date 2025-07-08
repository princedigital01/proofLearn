"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Loading from "@/app/loading"
import Link from "next/link"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Eye, 
  Edit, 
  Award,
  Coins
} from "lucide-react";



export default function MyCourses() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCourses = async () => {
      
    setLoading(true)
      try {
        const res = await fetch("/api/courses/my")
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load courses")
        setCourses(data)
      } catch (err: any) {
        setError(err.message)
    setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") fetchCourses()
  }, [status])

  return (
    <>
    <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Course Management</h2>
                  <Link href="/educators/createcourse">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Course
                  </Button>
                  </Link>
                </div>
                
    <div className=" mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>
      {error && <p className="text-red-600">{error}</p>}
      {courses.length === 0 ? (
        <p>{loading ? "loading...":"No courses found."}</p>
      ) : (
        <div className="space-y-4">
          
            <div className="flex flex-col md:grid grid-cols-2 gap-6">
              {courses.map((course,i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <img 
                        src={course.image || "/placeholder.svg"} 
                        alt={course.title}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                            {course.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.students||course.status === 'published' ? "12":"0"} students
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${course.revenue ||course.status === 'published' ? "1500":"0"} revenue
                          </div>
                          {course.rating > 0 ? (
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {course.rating} rating
                            </div>
                          ):(
                            <>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {"4.6"} rating
                            </div>
                            </>
                          )}
                        </div>
                        {course.status === 'published' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Course completion rate</span>
                              <span>{course.completion ||"70"}%</span>
                            </div>
                            <Progress value={course.completion||70} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Link href={`/educators/editCourse/${course._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
        </div>
      )}

    </div>
    </>
  )
}
