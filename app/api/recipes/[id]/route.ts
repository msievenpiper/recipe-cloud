import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET a single recipe by ID
export async function GET(request: Request, context: any) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse(null, { status: 401 });
    }

    let params = await context.params;

    const recipeId = parseInt(params.id);
    if (isNaN(recipeId)) {
        return new NextResponse("Invalid recipe ID", { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
    });

    if (!recipe) {
        return new NextResponse("Recipe not found", { status: 404 });
    }

    const isAuthor = recipe.authorId === session.user.id;
    const isSharedWithUser = await prisma.sharedRecipe.findUnique({
        where: {
            recipeId_sharedWithId: {
                recipeId: recipeId,
                sharedWithId: session.user.id,
            },
        },
    });

    if (!isAuthor && !isSharedWithUser) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(recipe);
}

// PUT to update a recipe
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse(null, { status: 401 });
    }

    const recipeId = parseInt(params.id);
    if (isNaN(recipeId)) {
        return new NextResponse("Invalid recipe ID", { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        select: { authorId: true },
    });

    if (!recipe || recipe.authorId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const { title, content, summary, icon } = await request.json();
    const updatedRecipe = await prisma.recipe.update({
        where: { id: recipeId },
        data: { title, content, summary, icon },
    });

    return NextResponse.json(updatedRecipe);
}
