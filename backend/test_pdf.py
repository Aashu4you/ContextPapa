
from pathlib import Path

from app.services.pdf_service import extract_text_from_pdf
from app.services.chunking_service import chunk_text

file_path = (
    Path(__file__).parent
    / "uploads"
    / "2d84f19f-6aa1-4eb8-ba6d-ca0edc0adcaa.pdf"
)

pages = extract_text_from_pdf(str(file_path))

chunks = chunk_text(pages)

print("Total pages:", len(pages))
print("Total chunks:", len(chunks))

for chunk in chunks:
    print("\n------------------------------")
    print("Chunk:", chunk["chunk_index"])
    print("Page:", chunk["page_number"])
    print(chunk["text"])
