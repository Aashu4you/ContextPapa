import uuid

from app.core.database import SessionLocal
from app.services.chunk_service import generate_and_save_embeddings

document_id = uuid.UUID(
    "2d84f19f-6aa1-4eb8-ba6d-ca0edc0adcaa"
)

db = SessionLocal()

try:
    count = generate_and_save_embeddings(db, document_id)
    print(f"Successfully saved {count} embeddings!")

finally:
    db.close()