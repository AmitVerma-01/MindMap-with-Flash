import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MindMap with Flash - AI-Powered Flashcard Generator",
    template: "%s | MindMap with Flash"
  },
  description: "Transform any topic into interactive AI-powered flashcards in seconds. Study smarter, remember longer, and ace your exams with intelligent learning materials. Free to start!",
  keywords: ["flashcards", "AI flashcards", "study tool", "learning app", "exam preparation", "spaced repetition", "AI learning", "study cards", "education technology"],
  authors: [{ name: "MindMap with Flash" }],
  creator: "MindMap with Flash",
  publisher: "MindMap with Flash",
  metadataBase: new URL('https://mindmapwithflash.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mindmapwithflash.vercel.app",
    title: "MindMap with Flash - AI-Powered Flashcard Generator",
    description: "Transform any topic into interactive AI-powered flashcards in seconds. Study smarter, remember longer, and ace your exams.",
    siteName: "MindMap with Flash",
    images: [
      {
        url: "/img.png",
        width: 1200,
        height: 630,
        alt: "MindMap with Flash - AI Flashcard Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindMap with Flash - AI-Powered Flashcard Generator",
    description: "Transform any topic into interactive AI-powered flashcards in seconds. Study smarter, remember longer.",
    images: ["/img.png"],
    creator: "@mindmapflash",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="shortcut icon" href="logo2.png" type="image/x-icon" />
          <StructuredData />
        </head>
        <body className={inter.className}>
          <NavBar/> 
          {children}
          <Footer/>
        </body>
      </html>
    </ClerkProvider>
  );
}
