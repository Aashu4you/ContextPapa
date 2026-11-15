"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 sm:px-6">
      <div
        className="flex items-end gap-3 rounded-xl border border-zinc-300 dark:border-zinc-700
                   bg-zinc-50 dark:bg-zinc-800/60 px-4 py-2.5 shadow-sm
                   focus-within:border-violet-400 dark:focus-within:border-violet-600
                   transition-colors"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask anything about your documents..."
          rows={1}
          aria-label="Chat message"
          className="flex-1 resize-none bg-transparent text-sm text-zinc-900 dark:text-zinc-100
                     placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                     focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                     min-h-[24px] leading-6 py-0.5"
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className="mb-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-lg
                     bg-violet-600 text-white shadow-sm
                     hover:bg-violet-700 active:bg-violet-800
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-violet-600
                     transition-colors"
        >
          {/* Paper-plane icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405z" />
          </svg>
        </button>
      </div>

      <p className="mt-1.5 text-center text-[11px] text-zinc-400 dark:text-zinc-600 select-none">
        Enter to send&nbsp;&middot;&nbsp;Shift+Enter for new line
      </p>
    </div>
  );
}

