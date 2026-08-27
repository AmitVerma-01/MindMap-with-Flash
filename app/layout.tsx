import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { clerkAppearance } from "@/lib/clerk-appearance";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "MindMap with Flash - AI-Powered Flashcard Generator | Free Study Tool",
    template: "%s | MindMap with Flash"
  },
  description: "Transform any topic into interactive AI-powered flashcards in seconds. Study smarter, remember longer, and ace your exams with intelligent learning materials. Free to start!",
  keywords: [
    "flashcards", 
    "AI flashcards", 
    "study tool", 
    "learning app", 
    "exam preparation", 
    "spaced repetition", 
    "AI learning", 
    "study cards", 
    "education technology",
    "online flashcard maker",
    "free flashcards",
    "study app",
    "memorization tool",
    "test prep",
    "student study tool",
    "AI study assistant",
    "smart flashcards",
    "digital flashcards",
    "exam study tool"
  ],
  authors: [{ name: "MindMap with Flash Team" }],
  creator: "MindMap with Flash",
  publisher: "MindMap with Flash",
  metadataBase: new URL('https://mindmapwithflash.kodeeslabs.com'),
  alternates: {
    canonical: '/',
  },
  category: 'Education',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mindmapwithflash.kodeeslabs.com",
    title: "MindMap with Flash - AI-Powered Flashcard Generator | Free Study Tool",
    description: "Transform any topic into interactive AI-powered flashcards in seconds. Study smarter, remember longer, and ace your exams with intelligent learning materials.",
    siteName: "MindMap with Flash",
    images: [
      {
        url: "/img.png",
        width: 1200,
        height: 630,
        alt: "MindMap with Flash - AI-Powered Flashcard Generator for Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindMap with Flash - AI-Powered Flashcard Generator | Free Study Tool",
    description: "Transform any topic into interactive AI-powered flashcards in seconds. Study smarter, remember longer, and ace your exams.",
    images: ["/img.png"],
    creator: "@mindmapflash",
    site: "@mindmapflash",
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
    ...(process.env.GOOGLE_SITE_VERIFICATION && {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    }),
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/logo2.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <head>
          <meta name="theme-color" content="#E8841A" />
          <StructuredData />
        </head>
        <body className={inter.className}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus-ring"
          >
            Skip to main content
          </a>
          <NavBar/>
          <main id="main-content">
            {children}
          </main>
          <Footer/>
        </body>
      </html>
    </ClerkProvider>
  );
}
