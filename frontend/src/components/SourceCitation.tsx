import type { ChatSource } from "@/types";

interface SourceCitationProps {
  sources: ChatSource[];
  /** map of document_id → filename, built from document list */
  documentNames?: Record<string, string>;
}

export default function SourceCitation({ sources, documentNames = {} }: SourceCitationProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 border-t border-zinc-200 dark:border-zinc-700/60 pt-3">
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
        Sources
      </p>
      <div className="flex flex-wrap gap-2">
        {sources.map((src, i) => {
          const name = documentNames[src.document_id];
          const label = name
            ? name.replace(/\.pdf$/i, "")
            : `Doc ${src.document_id.slice(0, 8)}…`;

          return (
            <div
              key={src.chunk_id ?? i}
              title={`Document ID: ${src.document_id}\nChunk: ${src.chunk_index}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-700
                         bg-zinc-50 dark:bg-zinc-800/60 px-3 py-1 text-xs text-zinc-700 dark:text-zinc-300
                         hover:border-violet-400 dark:hover:border-violet-500 hover:text-violet-700 dark:hover:text-violet-300
                         transition-colors cursor-default"
            >
              {/* Page badge */}
              <span
                className="inline-flex h-4 w-4 items-center justify-center rounded-full
                           bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300
                           text-[10px] font-bold leading-none"
              >
                {i + 1}
              </span>
              <span className="max-w-[140px] truncate font-medium">{label}</span>
              {src.page_number != null && (
                <span className="text-zinc-400 dark:text-zinc-500">p.{src.page_number}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

