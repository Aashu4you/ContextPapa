"use client";

import { useState } from "react";
import type { Document, SidebarView } from "@/types";

interface SidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  documents: Document[];
  onNewChat: () => void;
  chatCount: number;
}

export default function Sidebar({
  activeView,
  onViewChange,
  documents,
  onNewChat,
  chatCount,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-20 bg-black/40 sm:hidden"
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`relative z-30 flex flex-col border-r border-zinc-200 dark:border-zinc-800
                    bg-white dark:bg-zinc-900 transition-all duration-200
                    ${collapsed ? "w-14" : "w-64"}`}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-3">
          {!collapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                           bg-violet-600 text-white text-xs font-bold select-none"
              >
                CP
              </div>
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 truncate">
                ContextPapa
              </span>
            </div>
          )}

          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="ml-auto rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              {collapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              )}
            </svg>
          </button>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            title="New Chat"
            className={`flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700
                       bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm font-medium
                       text-zinc-700 dark:text-zinc-300
                       hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20
                       transition-colors w-full ${collapsed ? "justify-center px-0" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {!collapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {/* Chat History section */}
          {!collapsed && (
            <p className="mt-2 mb-1 px-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              Chat
            </p>
          )}
          <button
            onClick={() => onViewChange("chat")}
            title="Chat"
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors
                       ${collapsed ? "justify-center px-0" : ""}
                       ${
                         activeView === "chat"
                           ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-medium"
                           : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                       }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
            {!collapsed && (
              <span className="flex-1 truncate">Chat</span>
            )}
            {!collapsed && chatCount > 0 && (
              <span className="text-[10px] text-zinc-400">{chatCount}</span>
            )}
          </button>

          {/* Documents section */}
          {!collapsed && (
            <p className="mt-4 mb-1 px-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              Documents
            </p>
          )}
          <button
            onClick={() => onViewChange("documents")}
            title="Documents"
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors
                       ${collapsed ? "justify-center px-0" : ""}
                       ${
                         activeView === "documents"
                           ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-medium"
                           : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                       }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            {!collapsed && (
              <>
                <span className="flex-1 truncate">Documents</span>
                {documents.length > 0 && (
                  <span
                    className="rounded-full bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 text-[10px]
                               text-zinc-600 dark:text-zinc-300 font-medium"
                  >
                    {documents.length}
                  </span>
                )}
              </>
            )}
          </button>
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-3">
          <div
            className={`flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-600 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {!collapsed && <span>Settings</span>}
          </div>
        </div>
      </aside>
    </>
  );
}

