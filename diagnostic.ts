import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    console.error("GEMINI_API_KEY not found");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

async function list() {
    try {
        // The SDK might not have a direct listModels on genAI in all versions
        // Let's try a common model and see if it fails with a list
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Model initialized");
    } catch (e) {
        console.error(e);
    }
}

list();
