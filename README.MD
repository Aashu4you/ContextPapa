# ContextPapa

**An AI-powered personal knowledge assistant that helps you store, search, and interact with your documents.**

ContextPapa is a full-stack AI knowledge assistant that allows users to upload PDF documents, retrieve relevant information through semantic search, and ask questions using Retrieval-Augmented Generation (RAG).

It combines vector embeddings, PostgreSQL with pgvector, and Large Language Models to generate context-aware answers grounded in uploaded documents, with source citations.

## Features

- PDF document upload and local file storage.
- PDF text extraction using PyMuPDF.
- Automatic text chunking with overlapping chunks.
- Semantic embeddings using Sentence Transformers.
- Vector storage and similarity search using pgvector.
- RAG-based question answering using the Groq API.
- Context-aware answers grounded in uploaded documents.
- Source citations with document names and page numbers.
- Document listing, retrieval, and deletion.
- Automatic embedding generation during document processing.
- Next.js frontend with an interactive chat interface.
- Document library with upload and deletion functionality.
- Interactive API documentation through Swagger UI.

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
- Sentence Transformers

### AI & RAG
- Retrieval-Augmented Generation (RAG)
- `all-MiniLM-L6-v2` for text embeddings
- Groq API for LLM-powered responses
- `openai/gpt-oss-120b` model
- Cosine similarity search

### Database & Infrastructure
- PostgreSQL 16
- pgvector
- Docker
- Docker Compose

## How the RAG Pipeline Works

1. **Document Upload:** The user uploads a PDF through the frontend.
2. **Text Extraction:** PyMuPDF extracts text and page information from the PDF.
3. **Text Chunking:** Extracted text is divided into smaller overlapping chunks.
4. **Embedding Generation:** Sentence Transformers converts each chunk into a 384-dimensional vector.
5. **Vector Storage:** Text chunks, metadata, and embeddings are stored in PostgreSQL using pgvector.
6. **Semantic Search:** The user's question is converted into an embedding, and relevant document chunks are retrieved using vector similarity.
7. **Answer Generation:** Retrieved context is passed to the Groq LLM to generate a grounded answer.
8. **Source Citations:** The response includes references to the source documents and page numbers.

## Project Structure

```text
ContextPapa/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── tests/
│   ├── .env
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
- Groq API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Aashu4you/ContextPapa.git
cd ContextPapa
```

### 2. Start PostgreSQL with Docker

From the project root:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

View database logs:

```bash
docker compose logs -f db
```

**Database configuration**

```text
Host: localhost
Port: 5432
Database: knowbase_db
Username: knowbase
Password: knowbase_dev_password
```

The pgvector extension is used for storing and querying vector embeddings.

### 3. Configure the backend

Navigate to the backend directory:

```cmd
cd backend
```

Create a virtual environment:

```cmd
py -m venv venv
```

Activate it:

```cmd
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your local `.env` file using `.env.example` if it is included in the repository:

```cmd
copy .env.example .env
```

Configure the database connection using the existing database credentials:

```env
DATABASE_URL=postgresql+psycopg://knowbase:knowbase_dev_password@localhost:5432/knowbase_db
```

Add your Groq API key using the environment variable expected by the backend configuration.

**Important:** Never commit `.env` files or expose API keys publicly.

### 4. Start the FastAPI backend

From the backend directory:

```bash
uvicorn app.main:app --reload
```

Backend:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs

### 5. Configure and start the frontend

Open a new terminal:

```cmd
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend:

http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Backend health check |
| GET | `/health/db` | Database connectivity check |
| POST | `/documents/upload` | Upload a PDF |
| GET | `/documents/` | Retrieve all documents |
| GET | `/documents/{document_id}` | Retrieve a specific document |
| DELETE | `/documents/{document_id}` | Delete a document and its chunks |
| POST | `/documents/{document_id}/process` | Extract, chunk, and generate embeddings |
| GET | `/search/` | Semantic search across documents |
| POST | `/chat/` | Ask questions using RAG |

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

Rebuild and start:

```bash
docker compose up -d --build
```

View running containers:

```bash
docker compose ps
```

Open PostgreSQL shell:

```bash
docker exec -it contextpapa-db psql -U knowbase -d knowbase_db
```

List database tables:

```sql
\dt
```

Check installed extensions:

```sql
SELECT extname FROM pg_extension;
```

Exit PostgreSQL:

```sql
\q
```

**Warning:** Avoid `docker compose down -v` unless you intentionally want to delete the persistent database volume and its data.

## Development Roadmap

- [x] Project initialization and architecture setup
- [x] FastAPI backend setup
- [x] PostgreSQL and pgvector configuration
- [x] SQLAlchemy database integration
- [x] Document upload, listing, retrieval, and deletion
- [x] PDF text extraction
- [x] Text chunking with overlap
- [x] Text embeddings generation
- [x] Vector storage using pgvector
- [x] Semantic search
- [x] RAG-based question answering
- [x] Source citations with page references
- [x] Next.js frontend integration
- [x] Document library and chat interface
- [x] End-to-end manual testing
- [ ] Persistent conversation history
- [ ] Automated test coverage
- [ ] Production deployment

## Current Status

**Working MVP – Under Development**

The core document ingestion and RAG pipeline is implemented and has been manually tested, including PDF uploads, embedding generation, semantic retrieval, question answering, source citations, and document deletion.

Future development will focus on persistent conversations, automated testing, and deployment.

## Important Database Configuration

Do not change these existing database values unless you intentionally update the Docker Compose configuration and backend environment variables together:

```text
Database: knowbase_db
Username: knowbase
Password: knowbase_dev_password
```

## Author

**Aashutosh Sharma**

- GitHub: https://github.com/Aashu4you
- LinkedIn: https://linkedin.com/in/aashutosh-sharma-207bab2b5/