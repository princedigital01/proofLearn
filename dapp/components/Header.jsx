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
            <div className="container mx-auto px-4 py-4 items-center justify-between hidden md:flex ">
                <div className="flex items-center space-x-2">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">{title}</span>
                </div> 
                <nav className="flex gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.id}
                            href={link.href}
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                        >{link.title}</Link>
                    ))}


                </nav>

                <div className="flex gap-3">
                    {session ? (
                        // User is logged in
                        <>
                        {children}
                        <Button variant="outline" onClick={() => signOut()}>
                            Sign Out
                        </Button>
                        </>
                    ) : (
                        // User is NOT logged in
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/create">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>

            </div>
            <div className="container mx-auto px-6 py-4 flex flex-col items-center justify-between gap-3 md:hidden ">
                <div className='flex w-screen justify-between px-4'>
                    <div className="flex items-center space-x-2">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">{title}</span>
                </div>
                <div className="flex space-x-3 ">
                    {session ? (
                        // User is logged in
                        <>
                        <Button variant="outline" onClick={() => signOut()}>
                            Sign Out
                        </Button>
                        </>
                    ) : (
                        // User is NOT logged in
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            
                        </>
                    )}

                    <HamburgerMenu links={navLinks} />
                    
                </div>
                </div>
                <div className='w-screen'>{children}</div>
            </div>
            
        </header>
    )
}

export default Header