import { featureItems } from '@/utils/features'
import FeatureCard from "@/components/FeatureCard";
import Link from "next/link";
import PriceCard from "@/components/PriceCard";
import HeroSection from "@/components/HeroSection";
import CTASection from "@/components/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Powered Flashcard Generator - Study Smarter | Free Online Tool",
  description: "Create AI-generated flashcards instantly from any topic. Master subjects faster with intelligent study tools. Free to start, no credit card required. Perfect for students, teachers, and exam prep.",
  keywords: [
    "AI flashcard generator",
    "free flashcard maker",
    "online study cards",
    "automatic flashcard creator",
    "study tool online",
    "exam preparation tool",
    "learning flashcards",
    "smart study app"
  ],
  openGraph: {
    title: "AI-Powered Flashcard Generator - Study Smarter | Free Online Tool",
    description: "Create AI-generated flashcards instantly from any topic. Master subjects faster with intelligent study tools. Free to start, no credit card required.",
    images: ["/img.png"],
    url: "https://mindmapwithflash.kodeeslabs.com",
  },
  alternates: {
    canonical: "https://mindmapwithflash.kodeeslabs.com",
  },
};

export default function Home() {

  return (
   <main className="relative overflow-hidden">
      {/* Animated liquid background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f2f45] via-[#265973] to-[#1a4d6d]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-[#2B74AB] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-[#265973] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#CCFFFF] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>
      
      <div className="relative z-10"> 
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="w-full py-16 flex justify-center items-center" aria-label="Platform Statistics">
        <div className="w-11/12 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8" role="list">
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#CCFFFF] mb-2">10K+</div>
              <div className="text-gray-300 text-sm md:text-base">Flashcards Created</div>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#CCFFFF] mb-2">5K+</div>
              <div className="text-gray-300 text-sm md:text-base">Active Learners</div>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#CCFFFF] mb-2">95%</div>
              <div className="text-gray-300 text-sm md:text-base">Success Rate</div>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#CCFFFF] mb-2">4.9★</div>
              <div className="text-gray-300 text-sm md:text-base">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 flex justify-center items-center" aria-labelledby="how-it-works-heading">
        <div className="w-11/12 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block glass-card px-6 py-2 rounded-full mb-6">
              <span className="text-sm font-bold text-[#CCFFFF] tracking-wider">⚡ HOW IT WORKS</span>
            </div>
            <h2 id="how-it-works-heading" className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Create Flashcards in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B74AB] to-[#CCFFFF]">3 Simple Steps</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card glass-card-hover p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Enter Your Topic</h3>
              <p className="text-gray-300">
                Simply type in any subject, concept, or question you want to learn about.
              </p>
            </div>
            
            <div className="glass-card glass-card-hover p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Generates Cards</h3>
              <p className="text-gray-300">
                Our advanced AI creates comprehensive flashcards with questions and answers instantly.
              </p>
            </div>
            
            <div className="glass-card glass-card-hover p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Study & Master</h3>
              <p className="text-gray-300">
                Review your flashcards, track progress, and master any subject efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 flex justify-center items-center" aria-labelledby="features-heading">
         <div className="w-11/12 md:w-4/5 flex flex-col gap-y-12">
            <div className="text-center">
                <div className="inline-block glass-card px-6 py-2 rounded-full mb-6">
                  <span className="text-sm font-bold text-[#CCFFFF] tracking-wider">🚀 POWERFUL FEATURES</span>
                </div>
                <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                  Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B74AB] to-[#CCFFFF]">Learn Better</span>
                </h2>
                <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                  MindMapWithFlash combines the power of AI-generated summaries, spaced repetition, and visual mind mapping to help you learn and retain information more effectively.
                </p>
            </div>
            <div className="flex justify-center items-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
                  {
                  featureItems.map((item,i) => (
                    <div key={i} className="glass-card glass-card-hover p-6 rounded-2xl animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                      <FeatureCard heading={item.heading} details={item.details}/>
                    </div>
                  ))
                  }
              </div>
            </div>
         </div>
      </section>
      {/* Pricing Preview Section */}
      <section className="w-full py-20 flex justify-center items-center" aria-labelledby="pricing-heading">
        <div className="w-11/12 max-w-6xl">
          <div className="flex items-center flex-col gap-y-6 text-center mb-16">
            <div className="glass-card px-6 py-2 rounded-full">
              <span className="text-sm font-bold text-[#CCFFFF] tracking-wider">💎 SIMPLE PRICING</span>
            </div>
            <h2 id="pricing-heading" className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
              Start Free, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B74AB] to-[#CCFFFF]">Upgrade Anytime</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
              Choose the plan that best fits your learning needs. All plans include AI-powered flashcard generation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
            {/* Free Plan */}
            <div className="glass-card glass-card-hover p-6 rounded-2xl">
              <PriceCard plan={false} activated={true}/>
            </div>
            
            {/* Pro Plan */}
            <div className="glass-card glass-card-hover p-6 rounded-2xl border-2 border-[#CCFFFF]/30 relative">
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-[#2B74AB] to-[#265973] px-4 py-1.5 rounded-full shadow-lg">
                  <span className="text-xs font-bold text-white">⭐ RECOMMENDED</span>
                </div>
              </div>
              <PriceCard plan={true} activated={false}/>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/pricing" className="inline-block group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-xl opacity-10"></div>
              <div className="relative glass-button px-8 py-4 rounded-xl font-bold text-white transition-transform group-hover:scale-105">
                View Detailed Pricing →
              </div>
            </Link>
            <p className="text-gray-400 text-sm mt-4">
              All plans include 14-day money-back guarantee
            </p>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="w-full py-20 flex justify-center items-center" aria-labelledby="testimonials-heading">
        <div className="w-11/12 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block glass-card px-6 py-2 rounded-full mb-6">
              <span className="text-sm font-bold text-[#CCFFFF] tracking-wider">💬 TESTIMONIALS</span>
            </div>
            <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B74AB] to-[#CCFFFF]">Students</span> Worldwide
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card glass-card-hover p-6 rounded-2xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                &quot;This app completely changed how I study. I went from struggling to acing my exams!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">SM</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Sarah M.</div>
                  <div className="text-gray-400 text-sm">Medical Student</div>
                </div>
              </div>
            </div>
            
            <div className="glass-card glass-card-hover p-6 rounded-2xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                &quot;The AI-generated flashcards are incredibly accurate. Saves me hours of manual work!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div>
                  <div className="text-white font-semibold">James D.</div>
                  <div className="text-gray-400 text-sm">Software Engineer</div>
                </div>
              </div>
            </div>
            
            <div className="glass-card glass-card-hover p-6 rounded-2xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                &quot;Best study tool I&apos;ve ever used. My grades improved significantly in just one semester!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">EL</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Emily L.</div>
                  <div className="text-gray-400 text-sm">Law Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
      </div>
   </main>
  );
}


