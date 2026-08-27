'use client'

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Button from "@/components/ui/Button";

export default function CTASection() {
  const { isSignedIn } = useUser();

  return (
    <div className="w-full py-16 md:py-20 flex justify-center items-center">
      <div className="w-11/12 max-w-6xl glass-card p-8 md:p-16 rounded-3xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl" aria-hidden="true" />

        <div className="relative z-10">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-primary-gradient">
              Transform
            </span>{" "}
            Your Learning?
          </h2>
          <p className="text-muted text-base md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Create AI flashcards, study with spaced repetition, and visualize topics with mind maps — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-4 md:mb-6">
            <Button asChild size="lg">
              <Link href={isSignedIn ? "/pages/flashcards" : "/sign-up"}>
                {isSignedIn ? "Get Started Free" : "Sign Up Free"}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
          <p className="text-muted text-sm">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </div>
  );
}
