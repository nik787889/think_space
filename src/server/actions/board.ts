"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createBoard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const board = await prisma.board.create({
        data: {
            userId: session.user.id,
            title: "Untitled Board",
        },
    });

    revalidatePath("/", "layout");
    redirect(`/board/${board.id}`);
}

export async function deleteBoard(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    await prisma.board.delete({
        where: {
            id,
            userId: session.user.id,
        },
    });

    // Revalidate layout to update sidebar
    revalidatePath("/", "layout");
}

export async function updateBoardFolder(id: string, folderId: string | null) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    await prisma.board.update({
        where: {
            id,
            userId: session.user.id,
        },
        data: {
            folderId,
        },
    });

    revalidatePath("/", "layout");
}
