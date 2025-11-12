# MindMapWithFlash

An AI-powered flashcard generator built with Next.js 14, helping users create and study flashcards effortlessly.

## [Demo](https://mindmapwithflash.vercel.app/)

## Features

- 🤖 AI-powered flashcard generation using OpenAI
- 🔐 Authentication with Clerk
- 💾 Database integration with Prisma & PostgreSQL
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- ⚡ Built with Next.js 14 App Router

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Clerk
- **Database:** PostgreSQL with Prisma ORM
- **AI:** OpenAI (via OpenRouter)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Clerk account
- OpenRouter API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mindmapwithflash
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mindmapwithflash"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL_DEEPSEEK=deepseek/deepseek-chat
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── pages/             # Application pages
│   └── (auth)/            # Authentication pages
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema
├── public/               # Static assets
└── utils/                # Helper functions
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENROUTER_MODEL_DEEPSEEK` | AI model identifier |

## Deployment

Deploy easily on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
