import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindMap with Flash",
  description: "A AI Generated flash card website, which make learning easier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <link rel="shortcut icon" href="logo2.png" type="image/x-icon" />
        <body className={inter.className}>
          <NavBar/> 
          {children}
          <Footer/>
        </body>
      </html>
    </ClerkProvider>
  );
}
