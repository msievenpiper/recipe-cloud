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

    const { targetLanguage, languageCode } = await request.json();
    if (!targetLanguage && !languageCode) {
        return new NextResponse("Target language or language code is required", { status: 400 });
    }

    // Map language code to name if only code is provided, or vice versa
    // In a real app, this might be a more robust mapping
    const langCode = languageCode || targetLanguage?.substring(0, 2).toLowerCase();
    const langName = targetLanguage || languageCode; // Fallback, though frontend should ideally send both

    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
        });

        if (!recipe) {
            return new NextResponse("Recipe not found", { status: 404 });
        }

        // Check for existing translation
        if (langCode) {
            const existingTranslation = await prisma.recipeTranslation.findUnique({
                where: {
                    recipeId_languageCode: {
                        recipeId: recipeId,
                        languageCode: langCode,
                    },
                },
            });

            if (existingTranslation) {
                console.log(`Using cached translation for ${langCode}`);
                return NextResponse.json({
                    title: existingTranslation.title,
                    summary: existingTranslation.summary,
                    content: existingTranslation.content,
                });
            }
        }

        console.log(`Calling Gemini (${targetLanguage || langCode}) for translation. Using API key starting with:`, geminiApiKey?.substring(0, 5));
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Translate the following recipe into ${langName}. 
        Return the result in JSON format with exactly these fields: "title", "summary", "content".
        Preserve all Markdown formatting, structure, and headings in the "content" field.
        
        Recipe Title: ${recipe.title}
        Recipe Summary: ${recipe.summary}
        Recipe Content: ${recipe.content}`;

        const aiResult = await model.generateContent(prompt);
        const response = aiResult.response;
        const text = response.text();
        console.log("Raw Gemini response received. Length:", text.length);

        let translatedData;
        try {
            // Extract JSON block using regex if present, otherwise try parsing whole text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : text;
            translatedData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("Failed to parse Gemini response as JSON. Raw text:", text);
            return new NextResponse("Invalid response format from translation service", { status: 500 });
        }

        if (!translatedData.title || !translatedData.content) {
            console.error("Gemini response missing required fields:", translatedData);
            return new NextResponse("Translation service returned incomplete data", { status: 500 });
        }

        // Store the translation
        if (langCode) {
            try {
                await prisma.recipeTranslation.upsert({
                    where: {
                        recipeId_languageCode: {
                            recipeId: recipeId,
                            languageCode: langCode,
                        },
                    },
                    update: {
                        title: translatedData.title,
                        summary: translatedData.summary || "",
                        content: translatedData.content,
                    },
                    create: {
                        recipeId: recipeId,
                        languageCode: langCode,
                        title: translatedData.title,
                        summary: translatedData.summary || "",
                        content: translatedData.content,
                    },
                });
                console.log(`Stored translation for ${langCode}`);
            } catch (dbError) {
                console.error("Failed to store translation in DB:", dbError);
                // We still return the translated data even if storing it failed
            }
        }

        return NextResponse.json(translatedData);
    } catch (error: any) {
        console.error("Translation error detailed:", error);
        return new NextResponse(`Error during translation: ${error.message || 'Unknown error'}`, { status: 500 });
    }
}
