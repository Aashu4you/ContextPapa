
def chunk_text(pages, chunk_size=1000, overlap=200):
    if chunk_size <= 0:
        raise ValueError("Chunk size must be positive")

    if overlap < 0 or overlap >= chunk_size:
        raise ValueError("Overlap must be smaller than chunk size")

    chunks = []
    chunk_index = 0

    for page in pages:
        # Clean unnecessary whitespace
        text = " ".join(page["text"].split())

        start = 0

        while start < len(text):
            end = start + chunk_size

            chunk = text[start:end].strip()

            if chunk:
                chunks.append({
                    "chunk_index": chunk_index,
                    "page_number": page["page_number"],
                    "text": chunk
                })

                chunk_index += 1

            if end >= len(text):
                break

            start = end - overlap

    return chunks
