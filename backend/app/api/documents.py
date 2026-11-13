
import os
import uuid

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Document
from app.services.pdf_service import extract_text_from_pdf
from app.services.chunking_service import chunk_text
from app.services.chunk_service import save_chunks


router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    document_id = uuid.uuid4()
    file_path = os.path.join(
        UPLOAD_DIR,
        f"{document_id}.pdf"
    )

    try:
        content = file.file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="Uploaded PDF is empty"
            )

        with open(file_path, "wb") as f:
            f.write(content)

        document = Document(
            id=document_id,
            filename=file.filename,
            file_path=file_path,
            file_size=len(content),
            status="uploaded"
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        return {
            "message": "Document uploaded successfully",
            "document_id": str(document.id),
            "filename": document.filename,
            "file_size": document.file_size,
            "status": document.status
        }

    except HTTPException:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise

    except Exception:
        db.rollback()

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=500,
            detail="Document upload failed"
        )


@router.get("/")
def get_documents(db: Session = Depends(get_db)):
    documents = (
        db.query(Document)
        .order_by(Document.created_at.desc())
        .all()
    )

    return documents


@router.get("/{document_id}")
def get_document(
    document_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return document


@router.delete("/{document_id}")
def delete_document(
    document_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully",
        "document_id": str(document_id)
    }
    

@router.post("/{document_id}/process")
def process_document(
    document_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    try:
        pages = extract_text_from_pdf(document.file_path)

        if not pages:
            raise HTTPException(
                status_code=400,
                detail="No text found in PDF"
            )

        chunks = chunk_text(pages)

        saved_count = save_chunks(
            db,
            document.id,
            chunks
        )

        document.status = "processed"
        db.commit()

        return {
            "message": "Document processed successfully",
            "document_id": str(document.id),
            "total_pages": len(pages),
            "total_chunks": saved_count,
            "status": document.status
        }

    except HTTPException:
        raise

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Document processing failed"
        )