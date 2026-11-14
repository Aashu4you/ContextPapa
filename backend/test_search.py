from app.core.database import SessionLocal
from app.services.search_service import search_similar_chunks

db = SessionLocal()

try:
    query = "What programming languages and technologies does the candidate know?"

    results = search_similar_chunks(
        db=db,
        query=query,
        limit=3
    )

    print(f"\nSearch query: {query}\n")

    for result in results:
        print(f"Chunk Index: {result.chunk_index}")
        print(f"Page Number: {result.page_number}")
        print(f"Content: {result.content[:300]}")
        print("-" * 50)

finally:
    db.close()