import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mind Map Generator - Visual Learning",
  description:
    "Generate AI-powered mind maps from any topic or existing flashcard deck.",
};

export default function MindMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
