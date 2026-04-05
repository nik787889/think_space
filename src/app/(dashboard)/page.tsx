import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    // Fetch the user's boards from Postgres
    const boards = await prisma.board.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
            <header className="h-16 flex-shrink-0 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-30">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1 text-xs font-medium text-indigo-700">
                        Active Session: {session.user.name}
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-950">Your Workspaces</h2>
                    </div>

                    {boards.length === 0 ? (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                            <p className="text-slate-700 mb-4">No boards found. Create your first one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {boards.map((board) => (
                                <div
                                    key={board.id}
                                    className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                                >
                                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                                        {board.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Last edited {new Date(board.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}