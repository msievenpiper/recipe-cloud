import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const visionClient = new ImageAnnotatorClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse(null, { status: 401 })
    }
    const recipes = await prisma.recipe.findMany({
        where: { authorId: session.user.id },
    });
    return NextResponse.json(recipes);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse(null, { status: 401 })
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempFilePath = `/tmp/${file.name}`;
    fs.writeFileSync(tempFilePath, buffer);

    try {
        const [result] = await visionClient.textDetection(tempFilePath);
        const detections = result.textAnnotations;
        const text = detections.map(d => d.description).join(' ');

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
        const prompt = `Format the following recipe text into a clean, well-structured markdown document. It should start with a main heading for the recipe title. Include sections for description, yield, prep time, bake time, ingredients, instructions, and notes. Use markdown for all formatting (e.g., headings, lists, bold text). Here is the text: ${text}`;
        const aiResult = await model.generateContent(prompt);
        const response = aiResult.response;
        const markdownContent = response.text();

        // Extract the main title from the markdown
        const titleMatch = markdownContent.match(/^#\s*(.*)/);
        const title = titleMatch ? titleMatch[1] : 'Untitled Recipe';

        const newRecipe = await prisma.recipe.create({
            data: {
                title,
                content: markdownContent,
                authorId: session.user.id,
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
