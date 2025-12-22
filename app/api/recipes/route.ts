import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import { promisify } from 'util';

const visionClient = new ImageAnnotatorClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const dbAll = promisify(db.all.bind(db));
const dbRun = promisify(db.run.bind(db));

export async function GET() {
  const recipes = await dbAll('SELECT * FROM recipes');
  return NextResponse.json(recipes);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('image') as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const tempFilePath = `/tmp/${file.name}`;
  fs.writeFileSync(tempFilePath, buffer);

  try {
    const [result] = await visionClient.textDetection(tempFilePath);
    const detections = result.textAnnotations;
    const text = detections.map(d => d.description).join(' ');

    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = `Create a recipe from the following text: ${text}. The recipe should have a name, instructions, and notes.`;
    const aiResult = await model.generateContent(prompt);
    const response = await aiResult.response;
    const recipeText = response.text();

    const name = recipeText.match(/Name: (.*)/)[1];
    const instructions = recipeText.match(/Instructions: (.*)/)[1];
    const notes = recipeText.match(/Notes: (.*)/)[1];

    const resultRun = await dbRun('INSERT INTO recipes (name, instructions, notes) VALUES (?, ?, ?)', [name, instructions, notes]);
    return NextResponse.json({ id: resultRun.lastID });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error processing image', { status: 500 });
  } finally {
    fs.unlinkSync(tempFilePath);
  }
}
