# KnowBase

**An AI-powered personal knowledge assistant that helps you store, search, and interact with your documents.**

KnowBase is a full-stack application designed to let users upload documents, retrieve relevant information, and ask questions about their personal knowledge base. The long-term goal is to implement Retrieval-Augmented Generation (RAG) with semantic search and source citations.

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- PyMuPDF

### Database & Infrastructure
- PostgreSQL 16
- pgvector
- Docker
- Docker Compose

## Current Features

- PDF document upload.
- Document metadata stored in PostgreSQL.
- Local PDF file storage.
- Retrieve all uploaded documents.
- Retrieve individual documents using UUID.
- Delete documents and their associated database records.
- Database health-check endpoint.
- Interactive API documentation through Swagger UI.

## Project Structure

```text
KnowBase/
│
├── frontend/                 # Next.js frontend
│
├── backend/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── core/              # Database configuration
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── main.py            # FastAPI entry point
│   │
│   ├── uploads/               # Uploaded PDF files (ignored by Git)
│   ├── tests/
│   ├── .env                   # Local environment variables
│   └── requirements.txt
│
├── database/
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Python 3.13+
- Node.js 22+
- npm
- Docker Desktop
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/KnowBase.git
cd KnowBase
```

### 2. Start PostgreSQL using Docker

Start the PostgreSQL container with pgvector:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

Check database logs:

```bash
docker compose logs -f db
```

The database runs on:

```text
Host: localhost
Port: 5432
Database: knowbase_db
Username: knowbase
```

### 3. Configure the backend

Navigate to the backend:

```bash
cd backend
```

Create and activate a virtual environment.

**Windows CMD:**

```cmd
py -m venv .venv
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your local `.env` file using `.env.example`:

**Windows CMD:**

```cmd
copy .env.example .env
```

Configure the database connection in `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://knowbase:knowbase_dev_password@localhost:5432/knowbase_db
```

Replace the credentials if you have changed the Docker Compose database configuration.

### 4. Start the FastAPI backend

From the `backend` directory, with the virtual environment activated:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

Database health check:

```text
http://127.0.0.1:8000/health/db
```

### 5. Start the Next.js frontend

Open a **new terminal** and navigate to the frontend:

```bash
cd frontend
```

Install dependencies if this is the first run:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Useful Docker Commands

Start containers:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose stop
```

Stop and remove containers:

```bash
docker compose down
```

Rebuild and start containers:

```bash
docker compose up -d --build
```

View running containers:

```bash
docker compose ps
```

View database logs:

```bash
docker compose logs -f db
```

Open PostgreSQL shell:

```bash
docker exec -it knowbase-db psql -U knowbase -d knowbase_db
```

Check database tables:

```sql
\dt
```

Check pgvector extension:

```sql
SELECT extname FROM pg_extension;
```

Exit PostgreSQL:

```sql
\q
```

**Warning:** Avoid `docker compose down -v` unless you intentionally want to delete the persistent database volume and its data.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Backend health check |
| GET | `/health/db` | Database connectivity check |
| POST | `/documents/upload` | Upload a PDF |
| GET | `/documents/` | Retrieve all documents |
| GET | `/documents/{document_id}` | Retrieve a specific document |
| DELETE | `/documents/{document_id}` | Delete a document |

## Development Roadmap

- [x] Project initialization and architecture setup
- [x] FastAPI backend setup
- [x] PostgreSQL and pgvector configuration
- [x] SQLAlchemy database integration
- [x] Document database model
- [x] PDF upload API
- [x] Document listing and retrieval APIs
- [x] Document deletion API
- [ ] PDF text extraction
- [ ] Text cleaning and chunking
- [ ] Text embeddings generation
- [ ] Semantic search using pgvector
- [ ] RAG-based question answering
- [ ] Source citations and page references
- [ ] Conversation history
- [ ] Next.js frontend integration
- [ ] Testing and deployment

## Project Goal

The goal of KnowBase is to build a practical AI knowledge assistant that combines document processing, vector search, and Large Language Models to provide accurate, context-aware answers from user-uploaded documents.

This project is being developed incrementally to explore backend engineering, database design, vector embeddings, and Retrieval-Augmented Generation.

---

**Status:** Under Development 🚧