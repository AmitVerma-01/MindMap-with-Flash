import PageBackground from "@/components/layout/PageBackground";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />
      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-8 py-12 md:py-16">
        <PageHeader
          badge="ABOUT US"
          title="About MindMapWithFlash"
          subtitle="AI-powered learning for students and professionals"
          align="left"
        />
        <div className="space-y-4 text-base md:text-lg text-muted">
          <p>
            MindMapWithFlash is an AI-powered learning platform that helps students and professionals
            create effective flashcards and mind maps for better retention and understanding.
          </p>
          <p>
            Our mission is to make learning more efficient and enjoyable by leveraging the power
            of artificial intelligence to generate high-quality study materials.
          </p>
          <Card padding="lg" className="mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Key Features</h2>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>AI-generated flashcards from any topic</li>
              <li>Interactive card flipping interface</li>
              <li>Customizable difficulty levels</li>
              <li>Save and organize your flashcard sets</li>
              <li>Spaced repetition learning</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
