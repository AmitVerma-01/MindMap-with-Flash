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
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.png',
  },
  manifest: '/manifest.json',
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
          <meta name="theme-color" content="#2B74AB" />
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
