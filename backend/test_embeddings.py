from app.services.embedding_service import generate_embedding, generate_embeddings

text = "Artificial Intelligence helps computers understand information."

embedding = generate_embedding(text)

print("Single embedding dimensions:", len(embedding))

texts = [
    "Artificial Intelligence",
    "Machine Learning",
    "Web Development"
]

embeddings = generate_embeddings(texts)

print("Total embeddings:", len(embeddings))
print("Dimensions per embedding:", len(embeddings[0]))