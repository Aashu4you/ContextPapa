"use client";

import { useEffect, useState, useCallback } from "react";
import type { Document, DocumentStatus } from "@/types";
import { listDocuments, deleteDocument } from "@/lib/api";
import DocumentUpload from "@/components/DocumentUpload";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; classes: string }
> = {
  uploaded: {
    label: "Uploaded",
    classes:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  processing: {
    label: "Processing",
    classes:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  processed: {
    label: "Processed",
    classes:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  failed: {
    label: "Failed",
    classes:
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
};

interface DocumentLibraryProps {
  onDocumentsChange?: (docs: Document[]) => void;
}

export default function DocumentLibrary({ onDocumentsChange }: DocumentLibraryProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setError(null);
      const docs = await listDocuments();
      setDocuments(docs);
      onDocumentsChange?.(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, [onDocumentsChange]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDocument(id);
      await fetchDocuments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Upload area */}
      <DocumentUpload onUploadComplete={fetchDocuments} />

      <div className="px-4 pb-2">
        <div className="border-t border-zinc-200 dark:border-zinc-800" />
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Library
          </h2>
          <button
            onClick={fetchDocuments}
            aria-label="Refresh documents"
            className="text-xs text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            ↻ Refresh
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-5 w-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && documents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4" aria-hidden="true">📂</span>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">No documents yet</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">
              Upload a PDF above to get started.
            </p>
          </div>
        )}

        {!loading && !error && documents.length > 0 && (
          <ul className="flex flex-col gap-2">
            {documents.map((doc) => {
              const status =
                STATUS_CONFIG[doc.status as DocumentStatus] ?? STATUS_CONFIG.uploaded;
              const isDeleting = deletingId === doc.id;

              return (
                <li
                  key={doc.id}
                  className="group flex items-start gap-3 rounded-xl border border-zinc-200 dark:border-zinc-700/60
                             bg-white dark:bg-zinc-800/60 px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* PDF icon */}
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                               bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                      <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      title={doc.filename}
                      className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      {doc.filename}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${status.classes}`}
                      >
                        {status.label}
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        {formatBytes(doc.file_size)}
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        {formatDate(doc.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={isDeleting}
                    aria-label={`Delete ${doc.filename}`}
                    className="mt-0.5 shrink-0 rounded-md p-1.5 text-zinc-400 opacity-0 group-hover:opacity-100
                               hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400
                               disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isDeleting ? (
                      <div className="h-4 w-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

