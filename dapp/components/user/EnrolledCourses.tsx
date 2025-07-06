
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EnrolledCourses = () => {

      const enrolledCourses = [
    { id: 1, title: "Cardano Smart Contracts with Aiken", instructor: "Alice Thompson", progress: 75, totalLessons: 12, completedLessons: 9, image: "/placeholder.svg?height=200&width=300" },
    { id: 2, title: "DeFi Fundamentals on Cardano", instructor: "Bob Martinez", progress: 40, totalLessons: 15, completedLessons: 6, image: "/placeholder.svg?height=200&width=300" }
  ];


  return (
<>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Continue Learning</h2>
                  <Badge variant="secondary">{enrolledCourses.length} Active Courses</Badge>
                </div>
                <div className="flex flex-col md:grid grid-cols-2 gap-6">
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
                        <Button className="w-full">Continue Course</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
  )
}

export default EnrolledCourses