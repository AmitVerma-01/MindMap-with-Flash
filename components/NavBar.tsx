'use client'

import Image from "next/image";
import logo from '@/public/logo.png';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavBar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="h-14 w-full text-white font-medium glass-card border-b border-[#CCFFFF]/10 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 shadow-lg">
            {/* Logo */}
            <Link href={'/'} className="flex items-center font-mono hover:opacity-80 transition-opacity">
                <Image src={logo} alt="MindMapWithFlash" width={40} height={40} className="mr-2" />
                <div className="flex flex-col leading-tight">
                    <span className="text-base font-bold">MindMap</span>
                    <span className="ml-4 text-xs text-[#CCFFFF]">WithFlash.</span>
                </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-5">
                <div className="flex gap-x-5 text-sm">
                    <Link 
                        href={'/'} 
                        className={`hover:text-[#CCFFFF] transition-colors ${isActive('/') ? 'text-[#CCFFFF] font-semibold' : ''}`}
                    >
                        Home
                    </Link>
                    <SignedIn>
                        <Link 
                            href={'/pages/flashcards'} 
                            className={`hover:text-[#CCFFFF] transition-colors ${isActive('/pages/flashcards') ? 'text-[#CCFFFF] font-semibold' : ''}`}
                        >
                            Generate
                        </Link>
                        <Link 
                            href={'/dashboard'} 
                            className={`hover:text-[#CCFFFF] transition-colors ${isActive('/dashboard') ? 'text-[#CCFFFF] font-semibold' : ''}`}
                        >
                            Dashboard
                        </Link>
                    </SignedIn>
                    <Link 
                        href={'/pricing'} 
                        className={`hover:text-[#CCFFFF] transition-colors ${isActive('/pricing') ? 'text-[#CCFFFF] font-semibold' : ''}`}
                    >
                        Pricing
                    </Link>
                </div>
                
                {/* Auth Buttons */}
                <div className="flex gap-x-2 items-center">
                    <SignedOut>
                        <div className="glass-button px-3 py-1.5 rounded-lg text-xs transition-all">
                            <SignInButton />
                        </div>
                    </SignedOut>
                    <SignedOut>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-lg"></div>
                            <div className="relative px-3 py-1.5 text-xs font-semibold">
                                <SignUpButton/>
                            </div>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="glass-button p-2 rounded-lg"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-14 left-0 right-0 glass-card border-b border-[#CCFFFF]/10 shadow-xl md:hidden">
                    <div className="flex flex-col p-4 space-y-3">
                        <Link 
                            href={'/'} 
                            onClick={() => setMobileMenuOpen(false)}
                            className={`hover:text-[#CCFFFF] transition-colors py-2 text-sm ${isActive('/') ? 'text-[#CCFFFF] font-semibold' : ''}`}
                        >
                            Home
                        </Link>
                        <SignedIn>
                            <Link 
                                href={'/pages/flashcards'} 
                                onClick={() => setMobileMenuOpen(false)}
                                className={`hover:text-[#CCFFFF] transition-colors py-2 text-sm ${isActive('/pages/flashcards') ? 'text-[#CCFFFF] font-semibold' : ''}`}
                            >
                                Generate
                            </Link>
                            <Link 
                                href={'/dashboard'} 
                                onClick={() => setMobileMenuOpen(false)}
                                className={`hover:text-[#CCFFFF] transition-colors py-2 text-sm ${isActive('/dashboard') ? 'text-[#CCFFFF] font-semibold' : ''}`}
                            >
                                Dashboard
                            </Link>
                        </SignedIn>
                        <Link 
                            href={'/pricing'} 
                            onClick={() => setMobileMenuOpen(false)}
                            className={`hover:text-[#CCFFFF] transition-colors py-2 text-sm ${isActive('/pricing') ? 'text-[#CCFFFF] font-semibold' : ''}`}
                        >
                            Pricing
                        </Link>
                        <SignedOut>
                            <div className="pt-3 border-t border-[#CCFFFF]/10 space-y-2">
                                <div className="glass-button px-4 py-2 rounded-lg text-center text-sm">
                                    <SignInButton />
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-lg"></div>
                                    <div className="relative px-4 py-2 text-center text-sm font-semibold">
                                        <SignUpButton/>
                                    </div>
                                </div>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            )}
        </nav>
    );
}
