from sqlalchemy.orm import Session

from app.services.search_service import search_similar_chunks
from app.services.llm_service import generate_answer


def ask_question(db: Session, question: str):
    # Retrieve relevant document chunks
    chunks = search_similar_chunks(
        db=db,
        query=question,
        limit=3
    )

    if not chunks:
        return {
            "answer": "I couldn't find relevant information in your uploaded documents.",
            "sources": []
        }

    # Prepare context for the LLM
    context = "\n\n".join(
        [
            f"Source: Document {chunk.document_id}, "
            f"Page {chunk.page_number}\n{chunk.content}"
            for chunk in chunks
        ]
    )

    # Generate answer using Groq
    answer = generate_answer(
        question=question,
        context=context
    )

    # Prepare source citations
    sources = [
        {
            "document_id": str(chunk.document_id),
            "chunk_id": str(chunk.id),
            "chunk_index": chunk.chunk_index,
            "page_number": chunk.page_number
        }
        for chunk in chunks
    ]

    return {
        "answer": answer,
        "sources": sources
    }