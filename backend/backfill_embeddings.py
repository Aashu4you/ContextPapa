
from app.core.database import SessionLocal
from app.models import Chunk
from app.services.embedding_service import generate_embeddings

db = SessionLocal()

try:
    chunks = (
        db.query(Chunk)
        .filter(Chunk.embedding.is_(None))
        .order_by(Chunk.document_id, Chunk.chunk_index)
        .all()
    )

    print(f"Chunks needing embeddings: {len(chunks)}")

    if not chunks:
        print("All chunks already have embeddings.")
    else:
        texts = [chunk.content for chunk in chunks]
        embeddings = generate_embeddings(texts)

        if len(embeddings) != len(chunks):
            raise ValueError("Embedding count mismatch")

        for chunk, embedding in zip(chunks, embeddings):
            chunk.embedding = embedding

        db.commit()
        print(f"Successfully saved {len(chunks)} embeddings.")

except Exception as e:
    db.rollback()
    print(f"Backfill failed: {e}")
    raise

finally:
    db.close()
