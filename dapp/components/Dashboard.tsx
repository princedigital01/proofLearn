'use client';

import { useState } from "react"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Star, Users, Award, Coins, Filter } from "lucide-react";
import { WalletConnection } from "@/components/WalletConnection";
import { CourseCard } from "@/components/CourseCard";
import { CertificateGallery } from "@/components/CertificateGallery";
import { TokenBalance } from "@/components/TokenBalance";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data - in real app this would come from API/blockchain
  const enrolledCourses = [
    {
      id: 1,
      title: "Cardano Smart Contracts with Aiken",
      instructor: "Alice Thompson",
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 2,
      title: "DeFi Fundamentals on Cardano",
      instructor: "Bob Martinez",
      progress: 40,
      totalLessons: 15,
      completedLessons: 6,
      image: "/placeholder.svg?height=200&width=300"
    }
  ];

  const availableCourses = [
    {
      id: 3,
      title: "Building DApps with Mesh.js",
      instructor: "Carol Davis",
      price: 500,
      rating: 4.8,
      students: 234,
      duration: "8 hours",
      level: "Intermediate",
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 4,
      title: "Cardano Native Tokens",
      instructor: "David Wilson",
      price: 300,
      rating: 4.9,
      students: 156,
      duration: "6 hours",
      level: "Beginner",
      image: "/placeholder.svg?height=200&width=300"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold"><Link href= "/">Learn on Cardano</Link></span>
              </div>
              <nav className="hidden md:flex space-x-6 text-red">
                <Button variant="ghost">Dashboard</Button>
                <Button variant="ghost">My Courses</Button>
                <Button variant="ghost">Certificates</Button>
                <Button variant="ghost">Governance</Button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <TokenBalance />
              <WalletConnection />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-9">
            <Tabs defaultValue="my-courses" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="my-courses">My Courses</TabsTrigger>
                <TabsTrigger value="browse">Browse</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>

              {/* My Courses Tab */}
              <TabsContent value="my-courses" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Continue Learning</h2>
                  <Badge variant="secondary">
                    {enrolledCourses.length} Active Courses
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <CardDescription>by {course.instructor}</CardDescription>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {course.progress}%
                          </Badge>
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
              </TabsContent>

              {/* Browse Courses Tab */}
              <TabsContent value="browse" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {["All", "Blockchain", "DeFi", "Smart Contracts", "Development"].map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category.toLowerCase() ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category.toLowerCase())}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {availableCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </TabsContent>

              {/* Certificates Tab */}
              <TabsContent value="certificates">
                <CertificateGallery />
              </TabsContent>

              {/* Rewards Tab */}
              <TabsContent value="rewards" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-yellow-600" />
                      LEARN Token Rewards
                    </CardTitle>
                    <CardDescription>
                      Earn tokens by completing courses and participating in governance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">1,250</div>
                        <div className="text-sm text-gray-600">Total Earned</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">75</div>
                        <div className="text-sm text-gray-600">This Week</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">5</div>
                        <div className="text-sm text-gray-600">Streak Days</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Courses Completed</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Certificates Earned</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Study Streak</span>
                  <span className="font-semibold">5 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">LEARN Tokens</span>
                  <span className="font-semibold text-yellow-600">1,250</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-600" />
                  <div>
                    <div className="font-medium text-sm">Smart Contract Expert</div>
                    <div className="text-xs text-gray-600">Completed advanced course</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">Community Helper</div>
                    <div className="text-xs text-gray-600">Helped 10 students</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Governance Vote</div>
                  <div className="text-xs text-gray-600">Platform improvement proposal</div>
                  <div className="text-xs text-blue-600 mt-1">Ends in 2 days</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Live Webinar</div>
                  <div className="text-xs text-gray-600">DeFi on Cardano</div>
                  <div className="text-xs text-green-600 mt-1">Tomorrow 3 PM UTC</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
