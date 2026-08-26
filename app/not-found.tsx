import Link from "next/link";
import PageBackground from "@/components/layout/PageBackground";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      <PageBackground />
      <Card className="relative z-10 max-w-md text-center p-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted mb-6">This page could not be found.</p>
        <Link href="/">
          <Button>Go home</Button>
        </Link>
      </Card>
    </div>
  );
}
