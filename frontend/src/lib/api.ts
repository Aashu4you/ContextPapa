import type {
  Document,
  UploadDocumentResponse,
  ProcessDocumentResponse,
  DeleteDocumentResponse,
  ChatResponse,
  SearchResponse,
  ApiError,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = `HTTP ${res.status}`;
    try {
      const body: ApiError = await res.json();
      errorDetail = body.detail ?? body.message ?? errorDetail;
    } catch {
      // non-JSON error body — keep status string
    }
    throw new Error(errorDetail);
  }
  return res.json() as Promise<T>;
}

// ─── Documents API ────────────────────────────────────────────────────────────

export async function uploadDocument(file: File): Promise<UploadDocumentResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: "POST",
    body: form,
  });

  return handleResponse<UploadDocumentResponse>(res);
}

export async function processDocument(documentId: string): Promise<ProcessDocumentResponse> {
  const res = await fetch(`${API_BASE}/documents/${documentId}/process`, {
    method: "POST",
  });

  return handleResponse<ProcessDocumentResponse>(res);
}

export async function listDocuments(): Promise<Document[]> {
  const res = await fetch(`${API_BASE}/documents/`, {
    cache: "no-store",
  });

  return handleResponse<Document[]>(res);
}

export async function getDocument(documentId: string): Promise<Document> {
  const res = await fetch(`${API_BASE}/documents/${documentId}`);
  return handleResponse<Document>(res);
}

export async function deleteDocument(documentId: string): Promise<DeleteDocumentResponse> {
  const res = await fetch(`${API_BASE}/documents/${documentId}`, {
    method: "DELETE",
  });

  return handleResponse<DeleteDocumentResponse>(res);
}

// ─── Search API ───────────────────────────────────────────────────────────────

export async function semanticSearch(query: string, limit = 3): Promise<SearchResponse> {
  const params = new URLSearchParams({ query, limit: String(limit) });
  const res = await fetch(`${API_BASE}/search/?${params.toString()}`);
  return handleResponse<SearchResponse>(res);
}

// ─── Chat API ─────────────────────────────────────────────────────────────────

export async function sendChatMessage(question: string): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  return handleResponse<ChatResponse>(res);
}

