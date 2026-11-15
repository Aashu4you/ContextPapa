"use client";

import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { uploadDocument, processDocument } from "@/lib/api";

interface DocumentUploadProps {
  onUploadComplete: () => void;
}

type UploadPhase = "idle" | "uploading" | "processing" | "done" | "error";

export default function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setPhase("idle");
    setErrorMsg(null);
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setPhase("error");
      setErrorMsg("Only PDF files are allowed.");
      return;
    }

    setErrorMsg(null);

    try {
      setPhase("uploading");
      const uploadRes = await uploadDocument(file);

      setPhase("processing");
      await processDocument(uploadRes.document_id);

      setPhase("done");
      onUploadComplete();

      // Auto-reset after 2 s so user can upload another
      setTimeout(reset, 2000);
    } catch (err) {
      setPhase("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  // ── Drag & drop handlers ──────────────────────────────────────────────────
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => setIsDragOver(false);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isBusy = phase === "uploading" || phase === "processing";

  return (
    <div className="p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={onFileChange}
        aria-label="Select PDF file"
      />

      <div
        onClick={() => !isBusy && fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button"
        tabIndex={isBusy ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isBusy)
            fileInputRef.current?.click();
        }}
        aria-label="Drop zone: click or drag to upload a PDF"
        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed
                    px-6 py-8 text-center text-sm transition-colors select-none
                    ${isBusy ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                    ${
                      isDragOver
                        ? "border-violet-400 bg-violet-50 dark:border-violet-500 dark:bg-violet-900/20"
                        : phase === "error"
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                        : phase === "done"
                        ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10"
                        : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 hover:border-violet-400 dark:hover:border-violet-500"
                    }`}
      >
        {/* Icon */}
        {phase === "done" ? (
          <span className="text-3xl" aria-hidden="true">✅</span>
        ) : phase === "error" ? (
          <span className="text-3xl" aria-hidden="true">❌</span>
        ) : isBusy ? (
          <span className="text-3xl animate-pulse" aria-hidden="true">⏳</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8 text-zinc-400 dark:text-zinc-500"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        )}

        {/* Status text */}
        {phase === "uploading" && (
          <p className="font-medium text-zinc-700 dark:text-zinc-300">Uploading…</p>
        )}
        {phase === "processing" && (
          <p className="font-medium text-zinc-700 dark:text-zinc-300">Processing & indexing…</p>
        )}
        {phase === "done" && (
          <p className="font-medium text-green-700 dark:text-green-400">Document ready!</p>
        )}
        {phase === "error" && (
          <>
            <p className="font-medium text-red-700 dark:text-red-400">
              {errorMsg ?? "Upload failed"}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="mt-1 text-xs underline text-red-600 dark:text-red-400 hover:no-underline"
            >
              Try again
            </button>
          </>
        )}
        {phase === "idle" && (
          <>
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              Click to upload or drag &amp; drop
            </p>
            <p className="text-zinc-400 dark:text-zinc-500">PDF files only</p>
          </>
        )}
      </div>
    </div>
  );
}

