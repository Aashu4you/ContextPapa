from app.core.database import SessionLocal
from app.services.rag_service import ask_question

db = SessionLocal()

try:
    question = "What technologies and projects has the candidate worked on?"

    result = ask_question(
        db=db,
        question=question
    )

    print("\nQUESTION:")
    print(question)

    print("\nAI ANSWER:")
    print(result["answer"])

    print("\nSOURCES:")
    for source in result["sources"]:
        print(source)

finally:
    db.close()