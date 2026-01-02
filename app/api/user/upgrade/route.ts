import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                isPremium: true
            }
        });

        return NextResponse.json({ success: true, isPremium: updatedUser.isPremium });
    } catch (error) {
        console.error("Error upgrading user:", error);
        return new NextResponse("Error upgrading user", { status: 500 });
    }
}
