"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useSession } from 'next-auth/react';

const AvailableCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAvailableCourses(data.map(course => ({
            id: course._id,
            title: course.title || "Untitled Course",
            instructor: course.instructor || "Unknown Instructor",
            price: course.price || 0,
            rating: course.rating || 4.5,
            students: course.students || 0,
            duration: course.duration || "--",
            level: course.level || "Beginner",
            image: course.image || "/placeholder.svg?height=200&width=300"
          })));
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
    console.log(availableCourses)
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
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
        {loading ? (
          <p>Loading courses...</p>
        ) : (
          availableCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
        )}
      </div>
    </>
  );
};

export default AvailableCourses;
