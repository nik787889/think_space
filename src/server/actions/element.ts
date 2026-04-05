"use server";

import { prisma } from "@/lib/prisma";

export async function updateBoardElements(boardId: string, snapshotStr: string) {
  try {
    const snapshot = JSON.parse(snapshotStr);
    await prisma.board.update({
      where: { id: boardId },
      data: { snapshot },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to update board elements:", error);
    return { success: false, error: "Failed to update board elements" };
  }
}
