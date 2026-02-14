"use client"

import React, { use, useState } from 'react'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { menu } from 'framer-motion/client';

const Navbar = () => {
    const theme = "dark" // get theme from context
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const pathname = usePathname();
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const menuItems = [
        {href: "/", label: "Home"},
        {href: "/about", label: "About"},
        {href: "/projects", label: "Projects"},
        {href: "/blogs", label: "Blogs"},
        {href: "/contact", label: "Contact"},
    ]
  return (
    <nav className = 'fixed w-full bg-white/80 dark:bg-dark/80 backdrop-blur-sm z-50'>
        <div className='container max-w-7xl mx-auto px-4'>
            {/* Desktop Menu */}
            <div className='flex items-center justify-between h-16'>
                <Link href="/" className = 'text-xl font-bold text-primary'>Aditya&trade;</Link>

                {/* desktop menus */}
                <div className='hidden md:flex items-center space-x-8'>
                    {
                        menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className={`hover:text-primary transition-colors font-medium ${isActive ? 'text-primary' : ''}`}>{item.label}
                                </Link>
                            )
                        })
                    }
                </div>
            </div>

            {/* mobile menu */}
            
        </div>
    </nav>
  )
}

export default Navbar
