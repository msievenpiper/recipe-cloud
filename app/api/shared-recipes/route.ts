import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse(null, { status: 401 });
    }

    const sharedRecipes = await prisma.sharedRecipe.findMany({
        where: { sharedWithId: session.user.id },
        select: {
            recipe: {
                select: {
                    id: true,
                    title: true,
                    summary: true,
                    icon: true,
                    author: {
                        select: {
                            name: true,
                            email: true,
                        }
                    }
                }
            }
        }
    });

    return NextResponse.json(sharedRecipes.map(sr => sr.recipe));
}
