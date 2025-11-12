import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Manage Your Flashcards",
  description: "Access your AI-generated flashcard collections, track your learning progress, and study smarter.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
