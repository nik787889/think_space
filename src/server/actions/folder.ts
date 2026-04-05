"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createFolder(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    if (!name || name.trim() === "") {
        throw new Error("Folder name is required");
    }

    await prisma.folder.create({
        data: {
            name,
            userId: session.user.id,
        },
    });

    revalidatePath("/", "layout");
}
