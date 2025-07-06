"use client"
import EducatorDashboard from '@/components/EducatorDashboard'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from "@/app/loading";

const page = () => {

   const router = useRouter();
    const { data: session, status } = useSession({
      required: true,
      onUnauthenticated() {
        router.push('/login');
      },
    });
  
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
  

      if (status === "loading") {
        return <Loading />;
      }

     const firstName = session.user?.name?.trim().split(/\s+/)[0] || 'User';
    // const email= session.user?.email;
  return (
    <EducatorDashboard name={firstName} />
  )
}

export default page