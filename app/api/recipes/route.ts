import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
        const prompt = `Create a recipe from the following text: ${text}. The recipe should have a name, instructions, and notes.`;
        const aiResult = await model.generateContent(prompt);
        const response = aiResult.response;
        const recipeText = response.text();

        console.log(response);
        console.log(recipeText);

        const name = recipeText.match(/Name: (.*)/);
        const instructions = recipeText.match(/Instructions: (.*)/);
        const notes = recipeText.match(/Notes: (.*)/);

        const newRecipe = await prisma.recipe.create({
            data: {
                name,
                instructions,
                notes,
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
