// ─── Document Types ───────────────────────────────────────────────────────────

export type DocumentStatus = "uploaded" | "processing" | "processed" | "failed";

export interface Document {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  status: DocumentStatus;
  created_at: string;
}

export interface UploadDocumentResponse {
  message: string;
  document_id: string;
  filename: string;
  file_size: number;
  status: DocumentStatus;
}

export interface ProcessDocumentResponse {
  message: string;
  document_id: string;
  total_pages: number;
  total_chunks: number;
  status: DocumentStatus;
}

export interface DeleteDocumentResponse {
  message: string;
  document_id: string;
}

// ─── Chat Types ───────────────────────────────────────────────────────────────

export interface ChatSource {
  document_id: string;
  chunk_id: string;
  chunk_index: number;
  page_number: number;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  sources?: ChatSource[];
  isLoading?: boolean;
  error?: boolean;
  timestamp: Date;
}

// ─── Search Types ─────────────────────────────────────────────────────────────

export interface SearchResult {
  chunk_id: string;
  document_id: string;
  chunk_index: number;
  page_number: number;
  content: string;
}

export interface SearchResponse {
  query: string;
  total_results: number;
  results: SearchResult[];
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export type SidebarView = "chat" | "documents";

export interface ApiError {
  detail?: string;
  message?: string;
}

