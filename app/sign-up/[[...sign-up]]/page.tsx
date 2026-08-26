import { SignUp } from "@clerk/nextjs";
import PageBackground from "@/components/layout/PageBackground";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-y-auto flex items-start md:items-center justify-center px-4 py-8 md:py-10">
      <PageBackground />
      <div className="relative z-10 w-full max-w-md">
        <SignUp
          fallbackRedirectUrl="/pages/flashcards"
          signInFallbackRedirectUrl="/pages/flashcards"
          appearance={clerkAppearance}
        />
      </div>
    </div>
  );
}
