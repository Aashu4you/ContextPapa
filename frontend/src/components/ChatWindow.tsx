"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { ChatMessage as ChatMessageType, Document } from "@/types";
import { sendChatMessage } from "@/lib/api";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

const SUGGESTED_QUESTIONS = [
  "Summarize the key points from my documents.",
  "What are the main conclusions discussed?",
  "What topics are covered in my knowledge base?",
  "Find any definitions or explanations mentioned.",
];

interface ChatWindowProps {
  documents: Document[];
}

function nanoid() {
  return Math.random().toString(36).slice(2, 11);
}

export default function ChatWindow({ documents }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Build a name lookup from the document list
  const documentNames: Record<string, string> = {};
  for (const doc of documents) {
    documentNames[doc.id] = doc.filename;
  }

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (isLoading) return;

      const userMsg: ChatMessageType = {
        id: nanoid(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      const loadingMsg: ChatMessageType = {
        id: nanoid(),
        role: "assistant",
        content: "",
        isLoading: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, loadingMsg]);
      setIsLoading(true);

      try {
        const response = await sendChatMessage(content);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingMsg.id
              ? {
                  ...m,
                  content: response.answer,
                  sources: response.sources,
                  isLoading: false,
                }
              : m
          )
        );
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingMsg.id
              ? {
                  ...m,
                  content: errMsg,
                  isLoading: false,
                  error: true,
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const handleSuggestedQuestion = (q: string) => {
    sendMessage(q);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          /* ── Welcome screen ── */
          <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center">
            {/* Logo mark */}
            <div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl
                         bg-violet-100 dark:bg-violet-900/30 shadow-sm"
            >
              <span className="text-3xl select-none" aria-hidden="true">
                🧠
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
              Your knowledge, one conversation away.
            </h1>
            <p className="max-w-md text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-10">
              ContextPapa lets you upload PDFs, research papers, and notes — then ask questions and
              get AI-generated answers grounded in your own documents.
            </p>

            {/* Suggested questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800
                             px-4 py-3 text-left text-sm text-zinc-700 dark:text-zinc-300
                             hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20
                             transition-colors shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Message list ── */
          <div className="flex flex-col gap-5 py-6">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} documentNames={documentNames} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}

