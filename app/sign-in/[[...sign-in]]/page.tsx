import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative min-h-[80vh] overflow-hidden flex items-center justify-center">
      {/* Animated liquid background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f2f45] via-[#265973] to-[#1a4d6d]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-[#2B74AB] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-[#265973] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#CCFFFF] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "glass-card shadow-2xl",
            }
          }}
        />
      </div>
    </div>
  );
}
