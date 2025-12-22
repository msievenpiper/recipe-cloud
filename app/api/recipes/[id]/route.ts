import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse(null, { status: 401 })
    }
    const recipe = await prisma.recipe.findUnique({
        where: { id: parseInt(params.id) },
    });
    if (recipe.authorId !== session.user.id) {
        return new NextResponse(null, { status: 403 })
    }
    return NextResponse.json(recipe);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse(null, { status: 401 })
    }
    const recipe = await prisma.recipe.findUnique({
        where: { id: parseInt(params.id) },
    });
    if (recipe.authorId !== session.user.id) {
        return new NextResponse(null, { status: 403 })
    }
    const { content } = await request.json();
    const titleMatch = content.match(/^#\s*(.*)/);
    const title = titleMatch ? titleMatch[1] : 'Untitled Recipe';

    await prisma.recipe.update({
        where: { id: parseInt(params.id) },
        data: { title, content },
    });
    return new NextResponse(null, { status: 204 });
}
