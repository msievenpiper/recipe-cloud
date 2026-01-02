import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isPremium: true,
                scanCount: true,
                lastScanDate: true,
            },
            orderBy: { email: 'asc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return new NextResponse("Error fetching users", { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    try {
        const body = await request.json();
        const { id, role, isPremium } = body;

        if (!id) {
            return new NextResponse("User ID required", { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                role: role !== undefined ? role : undefined,
                isPremium: isPremium !== undefined ? isPremium : undefined
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return new NextResponse("Error updating user", { status: 500 });
    }
}
