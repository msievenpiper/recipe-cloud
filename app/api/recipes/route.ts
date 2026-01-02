import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import crypto from 'crypto';

const visionClient = new ImageAnnotatorClient();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse(null, { status: 401 });
    }
    const recipes = await prisma.recipe.findMany({
        where: { authorId: session.user.id },
        select: { id: true, title: true, summary: true, icon: true }
    });
    return NextResponse.json(recipes);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse(null, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a fingerprint for the image
    const imageFingerprint = crypto.createHash('sha256').update(buffer).digest('hex');

    // Check if a recipe with this fingerprint already exists for the user
    const existingRecipe = await prisma.recipe.findFirst({
        where: {
            authorId: session.user.id,
            imageFingerprint: imageFingerprint,
        },
    });

    if (existingRecipe) {
        return NextResponse.json({ duplicate: true, recipeId: existingRecipe.id }, { status: 200 });
    }

    const tempFilePath = `/tmp/${file.name}`;
    fs.writeFileSync(tempFilePath, buffer);

    try {
        const [result] = await visionClient.textDetection(tempFilePath);
        const detections = result.textAnnotations;
        if (!detections || detections.length === 0) {
          throw new Error("No text detections found.");
        }
        const text = detections.map(d => d.description).join(' ');

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `From the following recipe text, first provide a concise, one-sentence summary. Then, format the entire recipe into a clean, well-structured markdown document. It should start with a main heading for the recipe title. Include sections for description, yield, prep time, bake time, ingredients, instructions, and notes. Use markdown for all formatting (e.g., headings, lists, bold text). Where there are no step by step instructions please provide some appropriate steps based on the ingredients and title. 
        
        Example Output Format:
        Summary: This is a short summary of the recipe.
        
        # Recipe Title
        ... rest of the markdown content ...
        
        Here is the text: ${text}`;

        const aiResult = await model.generateContent(prompt);
        const response = aiResult.response;
        const fullAiResponse = response.text();

        const summaryMatch = fullAiResponse.match(/Summary: (.*)\n\n/);
        const summary = summaryMatch ? summaryMatch[1].trim() : 'No summary available.';
        const markdownContent = fullAiResponse.replace(/Summary: (.*)\n\n/, '').trim();

        const titleMatch = markdownContent.match(/^#\s*(.*)/);
        const title = titleMatch ? titleMatch[1] : 'Untitled Recipe';

        const newRecipe = await prisma.recipe.create({
            data: {
                title,
                summary,
                content: markdownContent,
                authorId: session.user.id,
                imageFingerprint: imageFingerprint, // Save the fingerprint
            },
        });

        return NextResponse.json({ id: newRecipe.id });
    } catch (error) {
        console.error(error);
        return new NextResponse('Error processing image', { status: 500 });
    } finally {
        fs.unlinkSync(tempFilePath);
    }
}
