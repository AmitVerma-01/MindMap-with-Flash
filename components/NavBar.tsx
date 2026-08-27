'use client'

import Image from "next/image";
import logo from '@/public/logo.png';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import Button from "@/components/ui/Button";

export default function NavBar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinkClass = (path: string) =>
        cn(
            "hover:text-primary transition-colors focus-ring rounded px-1",
            isActive(path) ? "text-primary font-semibold" : "text-foreground"
        );

    return (
        <nav aria-label="Main navigation" className="h-14 w-full text-foreground font-medium glass-card border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 shadow-lg">
            <Link href="/" className="flex items-center font-mono hover:opacity-80 transition-opacity focus-ring rounded">
                <Image src={logo} alt="MindMapWithFlash" width={40} height={40} className="mr-2" />
                <div className="flex flex-col leading-tight">
                    <span className="text-base font-bold">MindMap</span>
                    <span className="ml-4 text-xs text-primary">WithFlash.</span>
                </div>
            </Link>

            <div className="hidden md:flex items-center gap-5">
                <div className="flex gap-x-5 text-sm">
                    <Link href="/" className={navLinkClass('/')}>Home</Link>
                    <Link href="/about" className={navLinkClass('/about')}>About</Link>
                    <SignedIn>
                        <Link href="/pages/flashcards" className={navLinkClass('/pages/flashcards')}>Generate</Link>
                        <Link href="/pages/mindmap" className={navLinkClass('/pages/mindmap')}>Mind Map</Link>
                        <Link href="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>
                    </SignedIn>
                    <Link href="/pricing" className={navLinkClass('/pricing')}>Pricing</Link>
                </div>

                <div className="flex gap-x-2 items-center">
                    <SignedOut>
                        <SignInButton fallbackRedirectUrl="/pricing">
                            <Button variant="secondary" size="sm" type="button">
                                Sign in
                            </Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedOut>
                        <SignUpButton fallbackRedirectUrl="/pricing">
                            <Button size="sm" type="button">
                                Sign up
                            </Button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>

            <div className="md:hidden flex items-center gap-3">
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="glass-button p-2 rounded-lg focus-ring"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu"
                >
                    {mobileMenuOpen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {mobileMenuOpen && (
                <div id="mobile-menu" className="absolute top-14 left-0 right-0 glass-card border-b border-border shadow-xl md:hidden">
                    <div className="flex flex-col p-4 space-y-3">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className={cn(navLinkClass('/'), "py-2 text-sm")}>Home</Link>
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)} className={cn(navLinkClass('/about'), "py-2 text-sm")}>About</Link>
                        <SignedIn>
                            <Link href="/pages/flashcards" onClick={() => setMobileMenuOpen(false)} className={cn(navLinkClass('/pages/flashcards'), "py-2 text-sm")}>Generate</Link>
                            <Link href="/pages/mindmap" onClick={() => setMobileMenuOpen(false)} className={cn(navLinkClass('/pages/mindmap'), "py-2 text-sm")}>Mind Map</Link>
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={cn(navLinkClass('/dashboard'), "py-2 text-sm")}>Dashboard</Link>
                        </SignedIn>
                        <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className={cn(navLinkClass('/pricing'), "py-2 text-sm")}>Pricing</Link>
                        <SignedOut>
                            <div className="pt-3 border-t border-border space-y-2">
                                <SignInButton fallbackRedirectUrl="/pricing">
                                    <Button variant="secondary" fullWidth type="button">
                                        Sign in
                                    </Button>
                                </SignInButton>
                                <SignUpButton fallbackRedirectUrl="/pricing">
                                    <Button fullWidth type="button">
                                        Sign up
                                    </Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            )}
        </nav>
    );
}
