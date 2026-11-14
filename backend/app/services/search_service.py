from sqlalchemy.orm import Session

from app.models import Chunk
from app.services.embedding_service import generate_embedding


def search_similar_chunks(
    db: Session,
    query: str,
    limit: int = 3
):
    query_embedding = generate_embedding(query)

    results = (
        db.query(Chunk)
        .filter(Chunk.embedding.isnot(None))
        .order_by(Chunk.embedding.cosine_distance(query_embedding))
        .limit(limit)
        .all()
    )

    return results