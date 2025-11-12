'use client'

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function Pricing() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (plan: "free") => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Only allow free plan for now
    if (plan !== 'free') {
      alert('Pro plan is coming soon! Stay tuned.');
      return;
    }

    setLoading(plan);
    try {
      const response = await axios.post('/api/select-plan', { plan });
      
      if (response.data.success) {
        // Show success message
        alert(`✅ ${response.data.message}`);
        // Redirect to flashcard generation
        router.push('/pages/flashcards');
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
      alert("Failed to select plan. Please try again.");
    } finally {
      setLoading(null);
    }
  };
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated liquid background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f2f45] via-[#265973] to-[#1a4d6d]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-[#2B74AB] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-[#265973] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#CCFFFF] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-3">
            <div className="glass-card px-4 py-1.5 rounded-full">
              <span className="text-xs font-bold text-white/90 tracking-wider">💎 PRICING PLANS</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-2xl">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B74AB] via-[#CCFFFF] to-[#265973]">Learning Path</span>
          </h1>
          <p className="text-base text-gray-300 max-w-2xl mx-auto">
            Start free and upgrade anytime. All plans include AI-powered flashcard generation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
          {/* Free Plan */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col">
            <div className="mb-4">
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#265973]/30 border border-[#CCFFFF]/20 mb-3">
                <span className="text-xs font-bold text-[#CCFFFF]">FREE</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1.5">Starter</h3>
              <p className="text-gray-400 text-sm">Perfect for trying out the platform</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#CCFFFF] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 text-sm">50 credits per month</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#CCFFFF] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 text-sm">Basic AI generation</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#CCFFFF] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 text-sm">Save up to 10 sets</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#CCFFFF] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 text-sm">Study mode</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-gray-500 text-sm">Advanced analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-gray-500 text-sm">Priority support</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-gray-500 text-sm">Export & share features</span>
              </li>
            </ul>

            <button 
              onClick={() => handleSelectPlan('free')}
              disabled={loading !== null}
              className="w-full glass-button px-6 py-3 rounded-lg text-white text-sm font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
            >
              {loading === 'free' ? 'Selecting...' : 'Select Free Plan'}
            </button>
          </div>

          {/* Pro Plan - Coming Soon */}
          <div className="glass-card p-6 rounded-2xl relative border-2 border-gray-600/30 flex flex-col opacity-60">
            {/* Coming Soon Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-1.5 rounded-full shadow-lg">
                <span className="text-xs font-bold text-white">🚀 COMING SOON</span>
              </div>
            </div>

            <div className="mb-4 mt-3">
              <div className="inline-block px-3 py-0.5 rounded-full bg-gray-600/30 border border-gray-500/20 mb-3">
                <span className="text-xs font-bold text-gray-400">PRO</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-1.5">Professional</h3>
              <p className="text-gray-500 text-sm">For serious learners and students</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-gray-300">$5</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Available soon</p>
            </div>

            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-500 text-sm font-semibold">300 credits per month</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-500 text-sm font-semibold">Advanced AI generation</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-500 text-sm font-semibold">Unlimited sets</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-500 text-sm">Advanced study modes</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-500 text-sm">Progress analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-500 text-sm">Priority support</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-500 text-sm">Export & share features</span>
              </li>
            </ul>

            <button 
              disabled
              className="w-full px-6 py-3 rounded-lg text-gray-500 text-sm font-bold bg-gray-700/30 cursor-not-allowed mt-auto"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <div className="glass-card p-5 rounded-xl">
              <h3 className="text-base font-bold text-white mb-1.5">Can I cancel anytime?</h3>
              <p className="text-gray-400 text-sm">Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
            </div>
            <div className="glass-card p-5 rounded-xl">
              <h3 className="text-base font-bold text-white mb-1.5">What payment methods do you accept?</h3>
              <p className="text-gray-400 text-sm">We accept all major credit cards, PayPal, and other popular payment methods through our secure payment processor.</p>
            </div>
            <div className="glass-card p-5 rounded-xl">
              <h3 className="text-base font-bold text-white mb-1.5">Is there a free trial for Pro?</h3>
              <p className="text-gray-400 text-sm">The free plan lets you try our core features. Upgrade to Pro anytime to unlock unlimited access and advanced features.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
