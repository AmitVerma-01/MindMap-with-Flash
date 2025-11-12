import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MindMap with Flash - AI Flashcard Generator',
    short_name: 'MindMap Flash',
    description: 'Transform any topic into interactive AI-powered flashcards in seconds',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f2f45',
    theme_color: '#2B74AB',
    icons: [
      {
        src: '/logo2.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
