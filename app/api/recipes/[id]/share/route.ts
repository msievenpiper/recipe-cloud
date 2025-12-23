import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET: Fetch who the recipe is shared with
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    if (!session) {
        return new NextResponse(null, { status: 401 });
    }

    const recipeId = parseInt(id);
    if (isNaN(recipeId)) {
        return new NextResponse("Invalid recipe ID", { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        select: { authorId: true }
    });

    // Ensure the current user is the author of the recipe
    if (!recipe || recipe.authorId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const shares = await prisma.sharedRecipe.findMany({
        where: { recipeId: recipeId },
        select: {
            sharedWith: {
                select: {
                    id: true,
                    email: true,
                }
            }
        }
    });

    return NextResponse.json(shares.map(share => share.sharedWith));
}


// POST: Share a recipe with a user by email
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse(null, { status: 401 });
    }

    const { email: shareWithEmail } = await request.json();
    if (!shareWithEmail) {
        return new NextResponse("Email is required", { status: 400 });
    }

    const { id } = await params;
    const recipeId = parseInt(id);
    if (isNaN(recipeId)) {
        return new NextResponse("Invalid recipe ID", { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        select: { authorId: true }
    });

    // Ensure the current user is the author
    if (!recipe || recipe.authorId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const userToShareWith = await prisma.user.findUnique({
        where: { email: shareWithEmail }
    });

    if (!userToShareWith) {
        return new NextResponse("User not found", { status: 404 });
    }

    if (userToShareWith.id === session.user.id) {
        return new NextResponse("You cannot share a recipe with yourself.", { status: 400 });
    }

    try {
        const newShare = await prisma.sharedRecipe.create({
            data: {
                recipeId: recipeId,
                sharedWithId: userToShareWith.id,
            }
        });
        return NextResponse.json(newShare);
    } catch (error) {
        // This will catch unique constraint violations (already shared)
        return new NextResponse("Recipe already shared with this user.", { status: 409 });
    }
}

// DELETE: Revoke access for a user
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse(null, { status: 401 });
    }

    const { userId: revokeUserId } = await request.json();
    if (!revokeUserId) {
        return new NextResponse("User ID is required", { status: 400 });
    }

    const { id } = await params;
    const recipeId = parseInt(id);
    if (isNaN(recipeId)) {
        return new NextResponse("Invalid recipe ID", { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        select: { authorId: true }
    });

    // Ensure the current user is the author
    if (!recipe || recipe.authorId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.sharedRecipe.delete({
        where: {
            recipeId_sharedWithId: {
                recipeId: recipeId,
                sharedWithId: revokeUserId,
            }
        }
    });

    return new NextResponse(null, { status: 204 }); // No Content
}
