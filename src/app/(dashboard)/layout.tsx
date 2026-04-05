import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "./_components/sidebar";
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side session check
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const folders = await prisma.folder.findMany({
        where: { userId: session.user.id },
        include: { boards: { orderBy: { updatedAt: "desc" } } },
        orderBy: { createdAt: "asc" },
    });

    const unassignedBoards = await prisma.board.findMany({
        where: { userId: session.user.id, folderId: null },
        orderBy: { updatedAt: "desc" },
    });

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar folders={folders} unassignedBoards={unassignedBoards} />


            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}