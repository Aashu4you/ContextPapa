
from fastapi import FastAPI

app = FastAPI(
    title="KnowBase API",
    description="AI-powered personal knowledge assistant",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to KnowBase API",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
