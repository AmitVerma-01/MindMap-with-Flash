export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://mindmapwithflash.kodeeslabs.com/#webapp",
        "name": "MindMap with Flash",
        "alternateName": "MindMap Flash",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "lowPrice": "0",
          "highPrice": "5",
          "offerCount": "2",
          "offers": [
            {
              "@type": "Offer",
              "name": "Free Plan",
              "price": "0",
              "priceCurrency": "USD"
            },
            {
              "@type": "Offer",
              "name": "Pro Plan",
              "price": "5",
              "priceCurrency": "USD"
            }
          ]
        },
        "description": "AI-powered flashcard generator that transforms any topic into interactive learning materials. Create study cards instantly with artificial intelligence.",
        "url": "https://mindmapwithflash.kodeeslabs.com",
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
          "Export and share features",
          "Spaced repetition learning",
          "Mobile-friendly interface"
        ],
        "screenshot": "https://mindmapwithflash.kodeeslabs.com/img.png"
      },
      {
        "@type": "Organization",
        "@id": "https://mindmapwithflash.kodeeslabs.com/#organization",
        "name": "MindMap with Flash",
        "url": "https://mindmapwithflash.kodeeslabs.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://mindmapwithflash.kodeeslabs.com/logo2.png"
        },
        "sameAs": [
          "https://twitter.com/mindmapflash"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://mindmapwithflash.kodeeslabs.com/#website",
        "url": "https://mindmapwithflash.kodeeslabs.com",
        "name": "MindMap with Flash",
        "description": "AI-powered flashcard generator for smarter studying",
        "publisher": {
          "@id": "https://mindmapwithflash.kodeeslabs.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://mindmapwithflash.kodeeslabs.com/pages/flashcards?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is MindMap with Flash?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "MindMap with Flash is an AI-powered flashcard generator that transforms any topic into interactive learning materials in seconds. It helps students study smarter and remember information longer."
            }
          },
          {
            "@type": "Question",
            "name": "Is MindMap with Flash free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! MindMap with Flash offers a free plan with 50 credits per month. You can upgrade to Pro for unlimited access and advanced features."
            }
          },
          {
            "@type": "Question",
            "name": "How does AI flashcard generation work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Simply enter any topic or question, and our advanced AI instantly creates comprehensive flashcards with questions and answers. The AI analyzes the topic and generates relevant study materials automatically."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
