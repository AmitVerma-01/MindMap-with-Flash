import Link from "next/link";
import PageBackground from "@/components/layout/PageBackground";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function MindMapNotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      <PageBackground />
      <Card className="relative z-10 text-center p-8">
        <p className="text-muted mb-4">Mind map not found</p>
        <Button asChild>
          <Link href="/pages/mindmap">Create New Mind Map</Link>
        </Button>
      </Card>
    </div>
  );
}
