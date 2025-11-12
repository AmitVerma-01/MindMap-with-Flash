import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not defined in environment variables");
}

if (!process.env.OPENROUTER_MODEL_DEEPSEEK) {
  throw new Error("OPENROUTER_MODEL_DEEPSEEK is not defined in environment variables");
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const systemPrompt = `You are an expert educational content creator specializing in creating high-quality flashcards for effective learning and retention.

CORE PRINCIPLES:
1. Each flashcard must focus on ONE concept only
2. Questions should be clear, specific, and unambiguous
3. Answers should be concise yet complete
4. Use active recall principles - make learners think
5. Include context when necessary for understanding

QUESTION TYPES TO USE:
- Definition: "What is [concept]?"
- Application: "How would you use [concept] in [scenario]?"
- Comparison: "What's the difference between [A] and [B]?"
- Example: "Give an example of [concept]"
- Cause/Effect: "What happens when [action]?"
- Process: "What are the steps to [task]?"

QUALITY GUIDELINES:
- Front: 5-20 words (question/prompt)
- Back: 10-100 words (answer/explanation)
- Use simple, clear language
- Avoid ambiguity and vagueness
- Include examples when helpful
- Add mnemonics for complex concepts
- Ensure factual accuracy

DIFFICULTY LEVELS:
- Beginner: Basic definitions and simple concepts
- Intermediate: Applications and comparisons
- Advanced: Complex scenarios and deep analysis

OUTPUT FORMAT:
Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
    "flashcard": [
        {
            "front": "Clear, specific question or prompt",
            "back": "Concise, accurate answer with context"
        }
    ]
}

IMPORTANT RULES:
- Generate 5-8 flashcards unless specified otherwise
- NO markdown formatting (no \`\`\`json)
- NO introductory text
- NO explanatory comments
- ONLY the JSON object
- Ensure proper JSON escaping for quotes and special characters`;

interface FlashcardInput {
    topic?: string;
    level?: string;
    extra?: string;
    counts?: string;
    ques?: string;
}

async function createFlashcards({topic, level, extra, counts, ques}: FlashcardInput) {
  try {
    if (!topic && !ques) {
      throw new Error("Either topic or question must be provided");
    }

    let userMessage = "";
    if (topic) {
      const difficulty = level || 'intermediate';
      const cardCount = counts || '5-8';
      const additionalContext = extra ? `\n\nAdditional context: ${extra}` : '';
      
      userMessage = `Create ${cardCount} flashcards about: ${topic}
Difficulty level: ${difficulty}${additionalContext}

Focus on the most important concepts, use varied question types, and ensure each card tests a unique aspect of the topic.`;
    } else if (ques) {
      userMessage = `Create 1 flashcard with this question: "${ques}"
Provide a clear, accurate, and helpful answer.`;
    }

    const completion = await openai.chat.completions.create({ 
      model: process.env.OPENROUTER_MODEL_DEEPSEEK as string,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error("No response from AI model");
    }

    // Clean response - remove markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    // Parse JSON
    let flashcards;
    try {
      flashcards = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response was:", cleanedResponse);
      throw new Error("Failed to parse AI response as JSON");
    }
    
    // Validate structure
    if (!flashcards.flashcard || !Array.isArray(flashcards.flashcard)) {
      throw new Error("Invalid flashcard format received from AI");
    }

    // Validate each flashcard
    flashcards.flashcard = flashcards.flashcard.filter((card: any) => {
      return card.front && card.back && 
             typeof card.front === 'string' && 
             typeof card.back === 'string' &&
             card.front.trim().length > 0 &&
             card.back.trim().length > 0;
    });

    if (flashcards.flashcard.length === 0) {
      throw new Error("No valid flashcards generated");
    }

    return flashcards;
  } catch (error) {
    console.error("Error creating flashcards:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.topic && !data.ques) {
      return NextResponse.json(
        { error: "Either 'topic' or 'ques' field is required" }, 
        { status: 400 }
      );
    }

    const flashcards = await createFlashcards(data);
    return NextResponse.json(flashcards, { status: 200 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ msg: "working fine" });
}
