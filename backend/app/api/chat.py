from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.rag_service import ask_question

router = APIRouter(prefix="/chat", tags=["AI Chat"])


class ChatRequest(BaseModel):
    question: str = Field(min_length=2, max_length=2000)


@router.post("/")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    result = ask_question(
        db=db,
        question=request.question
    )

    return result