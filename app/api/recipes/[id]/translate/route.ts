import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse(null, { status: 401 });
    }

    if (!genAI) {
        return new NextResponse("Gemini API key not configured", { status: 500 });
    }

    const { id } = await params;
    const recipeId = parseInt(id);
    if (isNaN(recipeId)) {
        return new NextResponse("Invalid recipe ID", { status: 400 });
    }

    const { targetLanguage } = await request.json();
    if (!targetLanguage) {
        return new NextResponse("Target language is required", { status: 400 });
    }

    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
        });

        if (!recipe) {
            return new NextResponse("Recipe not found", { status: 404 });
        }

        console.log("Using API key starting with:", geminiApiKey?.substring(0, 5));
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Translate the following recipe into ${targetLanguage}. 
        Return the result in JSON format with exactly these fields: "title", "summary", "content".
        Preserve all Markdown formatting, structure, and headings in the "content" field.
        
        Recipe Title: ${recipe.title}
        Recipe Summary: ${recipe.summary}
        Recipe Content: ${recipe.content}`;

        const aiResult = await model.generateContent(prompt);
        const response = aiResult.response;
        let text = response.text();

        // Clean up markdown block if present
        if (text.startsWith('```json')) {
            text = text.replace(/^```json/, '').replace(/```$/, '').trim();
        }

        const translatedData = JSON.parse(text);

        return NextResponse.json(translatedData);
    } catch (error: any) {
        console.error("Translation error detailed:", error);
        return new NextResponse(`Error during translation: ${error.message || 'Unknown error'}`, { status: 500 });
    }
}
