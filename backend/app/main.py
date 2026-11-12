
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.models import Document
from app.core.database import test_db_connection
from app.api.documents import router as documents_router



Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KnowBase API",
    description="AI-powered personal knowledge assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to KnowBase API",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/health/db")
def database_health():
    try:
        result = test_db_connection()

        return {
            "database": "connected",
            "result": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(e)}"
        )
