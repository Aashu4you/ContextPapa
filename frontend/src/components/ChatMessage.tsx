"use client";

import { type ChatMessage as ChatMessageType } from "@/types";
import SourceCitation from "@/components/SourceCitation";

interface ChatMessageProps {
  message: ChatMessageType;
  documentNames?: Record<string, string>;
}

/** Animated dots for the loading state */
function LoadingDots() {
  return (
    <span className="inline-flex gap-1 items-center h-5">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

export default function ChatMessage({ message, documentNames }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end px-4 sm:px-6">
        <div
          className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-2.5
                     bg-violet-600 text-white text-sm leading-relaxed shadow-sm"
        >
          {message.content}
        </div>
      </div>
    );
  }

  // ── Assistant message ──────────────────────────────────────────────────────
  return (
    <div className="flex gap-3 px-4 sm:px-6">
      {/* Avatar */}
      <div
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                   bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300
                   text-xs font-bold select-none"
      >
        CP
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={`rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed shadow-sm
                      ${
                        message.error
                          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                          : "bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-100"
                      }`}
        >
          {message.isLoading ? (
            <LoadingDots />
          ) : (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          )}
        </div>

        {/* Sources */}
        {!message.isLoading && !message.error && message.sources && message.sources.length > 0 && (
          <SourceCitation sources={message.sources} documentNames={documentNames} />
        )}
      </div>
    </div>
  );
}

