import type { Metadata } from "next";
import Link from "next/link";
import PageBackground from "@/components/layout/PageBackground";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      <PageBackground />
      <Card className="relative z-10 max-w-md text-center p-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted mb-6">This page could not be found.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
