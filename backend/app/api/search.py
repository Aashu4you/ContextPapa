from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.search_service import search_similar_chunks

router = APIRouter(prefix="/search", tags=["Semantic Search"])


@router.get("/")
def semantic_search(
    query: str = Query(..., min_length=2),
    limit: int = Query(3, ge=1, le=10),
    db: Session = Depends(get_db)
):
    results = search_similar_chunks(
        db=db,
        query=query,
        limit=limit
    )

    return {
        "query": query,
        "total_results": len(results),
        "results": [
            {
                "chunk_id": str(result.id),
                "document_id": str(result.document_id),
                "chunk_index": result.chunk_index,
                "page_number": result.page_number,
                "content": result.content
            }
            for result in results
        ]
    }