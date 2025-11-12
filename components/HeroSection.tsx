'use client'

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import img from '@/public/img.png'

export default function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="flex flex-col md:flex-row justify-center items-center md:w-11/12 p-8 gap-12 max-w-7xl">
        <div className="md:w-1/2 flex flex-col space-y-6 animate-fade-in">
          <div className="inline-block">
            <div className="glass-card px-4 py-2 rounded-full inline-block">
              <span className="text-sm font-bold text-[#CCFFFF] tracking-wider">
                ✨ AI-Powered Learning
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl text-white font-bold leading-tight drop-shadow-2xl">
            Master Any Subject with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B74AB] via-[#CCFFFF] to-[#265973]">AI-Powered</span> Flashcards
          </h1>
          <p className="text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed">
            Transform any topic into interactive flashcards in seconds. Study smarter, remember longer, and ace your exams with AI-generated learning materials.
          </p>
          <div className="flex items-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#CCFFFF]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-300">Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#CCFFFF]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">No credit card required</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href={isSignedIn ? '/pages/flashcards' : '/sign-in'} 
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <div className="relative px-8 py-4 font-bold text-white transition-transform group-hover:scale-105 flex items-center gap-2">
                {isSignedIn ? 'Start Creating' : 'Sign In to Start'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
            <Link href={'/about'} className="glass-button px-8 py-4 rounded-xl font-bold text-white">
              Learn More
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
          <div className="relative float-animation">
            <div className="absolute inset-0 bg-[#2B74AB]/20 blur-3xl rounded-full"></div>
            <Image src={img} alt="MapMind with Flash" className="relative w-[50vh] md:w-full lg:w-full drop-shadow-2xl"/>
          </div>
        </div>
      </div>
    </div>
  );
}
