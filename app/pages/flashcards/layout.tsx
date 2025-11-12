import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Flashcards - AI-Powered Learning",
  description: "Transform any topic into interactive AI-powered flashcards instantly. Study smarter with intelligent learning materials.",
  openGraph: {
    title: "Generate Flashcards - AI-Powered Learning",
    description: "Transform any topic into interactive AI-powered flashcards instantly.",
  },
};

export default function FlashcardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
