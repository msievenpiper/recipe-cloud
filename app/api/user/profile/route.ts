import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            name: true,
            email: true,
            phoneNumber: true,
            address: true,
            role: true,
            isPremium: true,
            scanCount: true,
        }
    });

    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, email, phoneNumber, address } = body;

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                email, // Note: Allowing email update without verification for MVP
                phoneNumber,
                address
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
        return new NextResponse("Error updating profile", { status: 500 });
    }
}
