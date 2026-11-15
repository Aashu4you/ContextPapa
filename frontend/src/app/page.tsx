"use client";

import { useState, useCallback } from "react";
import type { Document, SidebarView } from "@/types";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import DocumentLibrary from "@/components/DocumentLibrary";

export default function Home() {
  const [view, setView] = useState<SidebarView>("chat");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chatKey, setChatKey] = useState(0);

  // Track how many chats have been started (for sidebar badge)
  const [chatCount, setChatCount] = useState(0);

  const handleNewChat = useCallback(() => {
    setChatKey((k) => k + 1);
    setChatCount((c) => c + 1);
    setView("chat");
  }, []);

  const handleDocumentsChange = useCallback((docs: Document[]) => {
    setDocuments(docs);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <Sidebar
        activeView={view}
        onViewChange={setView}
        documents={documents}
        onNewChat={handleNewChat}
        chatCount={chatCount}
      />

      {/* Main content */}
      <main className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {view === "chat" ? (
          <ChatWindow key={chatKey} documents={documents} />
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Documents header */}
            <header className="flex h-14 items-center border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6">
              <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Document Library
              </h1>
              <span className="ml-2 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {documents.length} {documents.length === 1 ? "file" : "files"}
              </span>
            </header>

            <div className="flex-1 overflow-hidden">
              <DocumentLibrary onDocumentsChange={handleDocumentsChange} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
