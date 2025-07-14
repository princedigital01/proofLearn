"use client"
import React from 'react'
import Link from "next/link";
import { navLinks } from '@/constants'
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import HamburgerMenu from '@/components/HamburgerMenu'
import { useSession, signOut } from 'next-auth/react';

const Header = ({children, title }) => {
    const { data: session, status } = useSession();
    console.log(session)

    return (
        <header className="border-b bg-white backdrop-blur-md sticky top-0 z-50">
           
            
        </header>
    )
}

export default Header