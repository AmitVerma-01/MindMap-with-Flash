import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import PageBackground from "@/components/layout/PageBackground";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to MindMapWithFlash to create and study AI-powered flashcards.",
};

export default function SignInPage() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-y-auto flex items-start md:items-center justify-center px-4 py-8 md:py-10">
      <PageBackground />
      <div className="relative z-10 w-full max-w-md">
        <SignIn
          fallbackRedirectUrl="/pricing"
          signUpFallbackRedirectUrl="/pricing"
          appearance={clerkAppearance}
        />
      </div>
    </div>
  );
}
