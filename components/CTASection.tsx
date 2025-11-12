'use client'

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function CTASection() {
  const { isSignedIn } = useUser();

  return (
    <div className="w-full py-20 flex justify-center items-center">
      <div className="w-11/12 max-w-6xl glass-card p-12 md:p-16 rounded-3xl text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2B74AB]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#CCFFFF]/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B74AB] to-[#CCFFFF]">Transform</span> Your Learning?
          </h2>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals using AI-powered flashcards to learn faster and remember more.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <Link 
              href={isSignedIn ? '/pages/flashcards' : '/sign-in'}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <div className="relative px-8 py-4 font-bold text-white transition-transform group-hover:scale-105 flex items-center gap-2">
                {isSignedIn ? 'Get Started Free' : 'Sign In to Get Started'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
            <Link href="/pricing" className="glass-button px-8 py-4 rounded-xl font-bold text-white">
              View Pricing
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </div>
  );
}
