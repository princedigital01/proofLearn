'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function HamburgerMenu({ links }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="md:hidden relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-700 hover:text-black focus:outline-none"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 w-[50vw] bg-white shadow-md flex flex-col gap-6 p-6">
                    {links.map((link) => (
                        <Link key={link.id} href={link.href} onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:underline">
                            {link.title}
                        </Link>
                    ))}

                    {/* <Link href="/courses" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:underline">
            Courses
          </Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:underline">
            Dashboard
          </Link>
          <Link href="/educators" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:underline">
            Educators
          </Link>
          <Link href="/governance" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:underline">
            Governance
          </Link>
          <Link href="/staking" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:underline">
            Staking
          </Link> */}
                </div>
            )}
        </div>
    )
}
