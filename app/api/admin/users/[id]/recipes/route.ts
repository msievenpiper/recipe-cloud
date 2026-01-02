import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request, apiParams: any) {
    const params = await apiParams.params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && !session.user.isImpersonating)) {
        // Also allow if impersonating (though technically original admin check is enough)
        // But strictly for this route, we want the actual admin to be calling it.
        // Actually, the impersonation logic puts the user in the 'USER' role usually, unless target is admin.
        // So we check if role is ADMIN OR if it's the original admin acting
        // However, this route is for the ADMIN DASHBOARD, so the user calling this SHOULD be an ADMIN.
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const userId = params.id;

    try {
        const recipes = await prisma.recipe.findMany({
            where: { authorId: userId },
            select: {
                id: true,
                title: true,
                createdAt: true,
                icon: true,
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(recipes);
    } catch (error) {
        console.error("Error fetching user recipes:", error);
        return new NextResponse("Error fetching recipes", { status: 500 });
    }
}
