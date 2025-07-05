'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import Header from "./Header";
import Link from "next/link";

const EducatorDashboard = ({name=""}) => {
  const [courses] = useState([
    {
      id: 1,
      title: "Cardano Smart Contracts with Aiken",
      students: 234,
      revenue: 1170,
      rating: 4.8,
      status: "published",
      completion: 85,
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 2,
      title: "DeFi Protocols on Cardano",
      students: 156,
      revenue: 780,
      rating: 4.9,
      status: "published",
      completion: 92,
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 3,
      title: "Advanced Plutus Development",
      students: 0,
      revenue: 0,
      rating: 0,
      status: "draft",
      completion: 60,
      image: "/placeholder.svg?height=200&width=300"
    }
  ]);

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const totalRevenue = courses.reduce((sum, course) => sum + course.revenue, 0);
  const avgRating = courses.filter(c => c.rating > 0).reduce((sum, course) => sum + course.rating, 0) / courses.filter(c => c.rating > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header title={`hi ${name}`}>
        <div className="flex justify-center items-center space-x-4">
          <Link href={"/educators/createcourse"}>
              <Button  className="flex items-center gap-2">
                
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                <Coins className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-800">2,450 LEARN</span>
              </div>
            </div>
      </Header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="flex flex-col md:grid grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LEARN Tokens</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,450</div>
              <p className="text-xs text-muted-foreground">
                +95 this week
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Course Management</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Course
              </Button>
            </div>

            <div className="flex flex-col md:grid grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <img 
                        src={course.image} 
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
                            {course.students} students
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${course.revenue} revenue
                          </div>
                          {course.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {course.rating} rating
                            </div>
                          )}
                        </div>
                        {course.status === 'draft' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Course completion</span>
                              <span>{course.completion}%</span>
                            </div>
                            <Progress value={course.completion} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track your course performance and student engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Course Enrollment Trends</h4>
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Chart placeholder</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Student Completion Rates</h4>
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Chart placeholder</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-600" />
                  Earnings & Rewards
                </CardTitle>
                <CardDescription>
                  Track your revenue and LEARN token rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">${totalRevenue}</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2,450</div>
                    <div className="text-sm text-gray-600">LEARN Tokens</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$245</div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-4">Recent Transactions</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Course Purchase</div>
                        <div className="text-sm text-gray-600">Cardano Smart Contracts</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$25</div>
                        <div className="text-sm text-gray-600">+ 50 LEARN</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Teaching Bonus</div>
                        <div className="text-sm text-gray-600">Monthly achievement</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-yellow-600">150 LEARN</div>
                        <div className="text-sm text-gray-600">Bonus reward</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>
                  Interact with your students and track their progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input placeholder="Search students..." className="flex-1" />
                    <Button variant="outline">Filter</Button>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: "John Doe", course: "Smart Contracts", progress: 75, joined: "2 weeks ago" },
                      { name: "Jane Smith", course: "DeFi Protocols", progress: 90, joined: "1 month ago" },
                      { name: "Bob Wilson", course: "Smart Contracts", progress: 45, joined: "3 days ago" }
                    ].map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-blue-600">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.course} • {student.joined}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{student.progress}% complete</div>
                            <Progress value={student.progress} className="w-20 h-2" />
                          </div>
                          <Button variant="outline" size="sm">Message</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EducatorDashboard;
