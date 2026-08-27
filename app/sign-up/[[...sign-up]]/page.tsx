import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import PageBackground from "@/components/layout/PageBackground";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free MindMapWithFlash account and start generating AI flashcards.",
};

export default function SignUpPage() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-y-auto flex items-start md:items-center justify-center px-4 py-8 md:py-10">
      <PageBackground />
      <div className="relative z-10 w-full max-w-md">
        <SignUp
          fallbackRedirectUrl="/pricing"
          signInFallbackRedirectUrl="/pricing"
          appearance={clerkAppearance}
        />
      </div>
    </div>
  );
}
