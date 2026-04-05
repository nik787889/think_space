"use client";

import { useState } from "react";
import { Folder, Board } from "@/generated/prisma/client";
import { createBoard, deleteBoard, updateBoardFolder } from "@/server/actions/board";
import { createFolder } from "@/server/actions/folder";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronRight, Folder as FolderIcon, MoreVertical, Plus, Trash2, File as FileIcon, FolderInput, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type SidebarProps = {
    folders: (Folder & { boards: Board[] })[];
    unassignedBoards: Board[];
};

export default function Sidebar({ folders, unassignedBoards }: SidebarProps) {
    const router = useRouter();
    const params = useParams();
    const activeBoardId = params.id as string | undefined;

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                },
            },
        });
    };

    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

    const toggleFolder = (folderId: string) => {
        setOpenFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
    };

    return (
        <aside className="w-64 border-r bg-white h-full flex flex-col pt-4">
            <h1 className="text-xl font-bold mb-6 px-4 italic text-slate-950 flex items-center justify-between">
                Think Space
            </h1>
            
            <div className="flex-1 overflow-y-auto px-2 space-y-4">
                {/* Folders Section */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-1 group">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Folders</span>
                        <button 
                            onClick={() => setIsCreatingFolder(true)}
                            className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {isCreatingFolder && (
                        <div className="px-2 mb-2">
                            <form 
                                action={async (formData) => {
                                    await createFolder(formData);
                                    setIsCreatingFolder(false);
                                }}
                                className="flex flex-col gap-2"
                            >
                                <input 
                                    name="name"
                                    autoFocus
                                    className="w-full text-sm border-2 border-indigo-100 outline-none rounded px-2 py-1 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                    placeholder="Folder name..."
                                    onBlur={() => setTimeout(() => setIsCreatingFolder(false), 150)}
                                />
                                <button type="submit" className="hidden">Submit</button>
                            </form>
                        </div>
                    )}

                    <div className="space-y-0.5">
                        {folders.map(folder => (
                            <div key={folder.id}>
                                <div 
                                    onClick={() => toggleFolder(folder.id)}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 text-sm text-slate-700 cursor-pointer group"
                                >
                                    {openFolders[folder.id] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                                    <FolderIcon className="w-4 h-4 text-indigo-500" />
                                    <span className="truncate flex-1 font-medium">{folder.name}</span>
                                </div>
                                
                                {openFolders[folder.id] && (
                                    <div className="ml-8 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2">
                                        {folder.boards.map(board => (
                                            <BoardItem 
                                                key={board.id} 
                                                board={board} 
                                                isActive={board.id === activeBoardId} 
                                                folders={folders}
                                            />
                                        ))}
                                        {folder.boards.length === 0 && (
                                            <div className="text-xs text-slate-400 py-1 px-2 italic">Empty folder</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Boards Section (Unassigned) */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-1 group mt-4">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Boards</span>
                        <form action={createBoard}>
                            <button 
                                type="submit"
                                className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                    
                    <div className="space-y-0.5">
                        {unassignedBoards.map(board => (
                           <BoardItem 
                               key={board.id} 
                               board={board} 
                               isActive={board.id === activeBoardId} 
                               folders={folders}
                           />
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="p-4 border-t mt-auto space-y-1">
                <form action={createBoard}>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm shadow-sm mb-1">
                        <Plus className="w-4 h-4" />
                        New Board
                    </button>
                </form>
                
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-500 hover:bg-slate-50 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </div>
        </aside>
    );
}

function BoardItem({ board, isActive, folders }: { board: Board, isActive: boolean, folders: (Folder & { boards: Board[] })[] }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <>
            <div className={`group flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors relative ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-100'}`}>
                <Link href={`/board/${board.id}`} className="flex items-center gap-2 flex-1 min-w-0">
                    <FileIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                    <span className="truncate">{board.title}</span>
                </Link>

                <div className="relative flex-shrink-0 ml-2">
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            setMenuOpen(!menuOpen);
                        }}
                        className={`p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-slate-200 transition-all ${menuOpen ? 'opacity-100 bg-slate-200' : ''}`}
                    >
                        <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    {menuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase">Move to</div>
                                {folders.map(folder => (
                                    <button
                                        key={folder.id}
                                        onClick={async () => {
                                            setMenuOpen(false);
                                            await updateBoardFolder(board.id, folder.id);
                                        }}
                                        disabled={board.folderId === folder.id}
                                        className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 flex items-center gap-2 ${board.folderId === folder.id ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'text-slate-700'}`}
                                    >
                                        <FolderInput className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="truncate">{folder.name}</span>
                                    </button>
                                ))}
                                {board.folderId && (
                                     <button
                                     onClick={async () => {
                                         setMenuOpen(false);
                                         await updateBoardFolder(board.id, null);
                                     }}
                                     className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                 >
                                     <FolderInput className="w-3.5 h-3.5 text-slate-400" />
                                     <span className="truncate text-slate-500 italic">Remove from folder</span>
                                 </button>
                                )}
                                
                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setShowDeleteModal(true);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 group/delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5 group-hover/delete:text-red-600" />
                                    Delete Board
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-150">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Board</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-slate-700">&quot;{board.title}&quot;</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    setShowDeleteModal(false);
                                    await deleteBoard(board.id);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
