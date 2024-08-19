import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const systemPrompt = `
You are a flashcard creator for MindMapWithFlash, a flash card creator website with both free and subscription models.
Your tasks:
1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. if number of flashcards is not specify then return 4-5 flash cards
12. if the question is present then return the answer of the question as back anf question as front.
Remember, the goal is to facilitate effective learning and retention of information through these flashcards.

make sure Return in the following JSON format but as a string:
{
    "flashcard": [
        {
            "front": "string",
            "back": "string"
        }
    ]
}
    only nothing extra. don't include "Here are 20 TypeScript flashcards:" types of lines in starting as well in ending
`;

interface input{
    topic? : string,
    level? : string,
    extra? : string,
    counts? : string,
    ques? : string
}

async function createFlashcards({topic, level, extra, counts, ques}:input) {
  try {
    let completion : any 
    if(topic){
        completion = await openai.chat.completions.create({ 
            model: "meta-llama/llama-3.1-8b-instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `topic : ${topic}, Level: ${level}(optional), extra: ${extra}(optional), flashcards couts: ${counts}` },
            ],
        });
    }
    if(ques){
        completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.1-8b-instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `front : ${ques} , only 1 flashcard` },
            ],
        });
    }
    (process.env.OPENROUTER_API_KEY);
    

    // Access the completion responsec
    const response = completion.choices[0]?.message?.content as string
    ({response});
    const flashcards = JSON.parse(response)

    
    return flashcards
  } catch (error) {
    console.error("Error creating flashcards:", error);
    return { error: "Failed to create flashcards",
        msg : error
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    (data);
    const flashcards = await createFlashcards(data);
    ({flashcards});
    return NextResponse.json(flashcards, { status: 200 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ msg: "working fine" });
}
