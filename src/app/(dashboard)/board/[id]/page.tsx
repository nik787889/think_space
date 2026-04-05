"use client";

import { use, useCallback, useRef, useMemo, useState } from "react";
import { Tldraw, Editor, getSnapshot } from "tldraw";
import "tldraw/tldraw.css";
import { MoreHorizontal } from "lucide-react";
import { updateBoardElements } from "@/server/actions/element";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import { liveblocksClient } from "@/lib/liveblocks.config";
import { useYjsStore } from "@/lib/useYjsStore";

interface BoardPageProps {
  params: Promise<{
    id: string;
  }>;
}

function Canvas({ boardId }: { boardId: string }) {
  const store = useYjsStore({});
  const [showStyles, setShowStyles] = useState(true);

  const timeoutRef = useRef<any>(null);

  const handleMount = useCallback((editor: Editor) => {
    editor.store.listen(
      () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          const snapshot = getSnapshot(editor.store);
          updateBoardElements(boardId, JSON.stringify(snapshot));
        }, 1000);
      },
      { scope: "document", source: "user" }
    );
  }, [boardId]);

  return (
    <div className={`relative w-full h-full ${!showStyles ? "hide-styles" : ""}`}>
      <style>{`
        .hide-styles .tlui-style-panel,
        .hide-styles .tlui-navigation-panel,
        .hide-styles .tlui-help-menu {
          display: none !important;
        }
      `}</style>
      <Tldraw
        store={store}
        onMount={handleMount}
        components={{
          SharePanel: () => (
            <div className="pointer-events-auto flex items-center pr-2">
              <button
                onClick={() => setShowStyles(!showStyles)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border shadow-sm transition-all duration-200 z-[100] ${
                  showStyles 
                    ? "bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700" 
                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
                title={showStyles ? "Hide Options" : "Show Options"}
              >
                <div className={`transition-transform duration-300 ${showStyles ? "rotate-180" : "rotate-0"}`}>
                   <MoreHorizontal className="w-5 h-5" />
                </div>
              </button>
            </div>
          ),
        }}
      />
    </div>
  );
}

export default function BoardPage({ params }: BoardPageProps) {
  // Unwrap the params promise (Next.js 15+ requirement for dynamic route params)
  const resolvedParams = use(params);
  const boardId = resolvedParams.id;

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={boardId}>
        <div className="relative w-full h-full overflow-hidden">
          <ClientSideSuspense fallback={<div className="flex items-center justify-center w-full h-full">Loading Collaborative Canvas...</div>}>
            <Canvas key={boardId} boardId={boardId} />
          </ClientSideSuspense>
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
