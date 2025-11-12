export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "MindMap with Flash",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0",
      "highPrice": "5",
      "offerCount": "2"
    },
    "description": "AI-powered flashcard generator that transforms any topic into interactive learning materials",
    "url": "https://mindmapwithflash.vercel.app",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "5000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "AI-powered flashcard generation",
      "Unlimited flashcard sets",
      "Study mode with flip cards",
      "Progress tracking",
      "Export and share features"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
