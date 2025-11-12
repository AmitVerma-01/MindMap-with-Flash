export default function About() {
  return (
    <div className="min-h-screen bg-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About MindMapWithFlash</h1>
        <div className="space-y-4 text-lg text-gray-300">
          <p>
            MindMapWithFlash is an AI-powered learning platform that helps students and professionals
            create effective flashcards and mind maps for better retention and understanding.
          </p>
          <p>
            Our mission is to make learning more efficient and enjoyable by leveraging the power
            of artificial intelligence to generate high-quality study materials.
          </p>
          <div className="mt-8 p-6 bg-gray-700 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>AI-generated flashcards from any topic</li>
              <li>Interactive card flipping interface</li>
              <li>Customizable difficulty levels</li>
              <li>Save and organize your flashcard sets</li>
              <li>Spaced repetition learning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
