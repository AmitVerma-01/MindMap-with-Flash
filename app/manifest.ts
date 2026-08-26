import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MindMap with Flash - AI Flashcard Generator',
    short_name: 'MindMap Flash',
    description: 'Transform any topic into interactive AI-powered flashcards in seconds',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1419',
    theme_color: '#E8841A',
    icons: [
      {
        src: '/logo2.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
