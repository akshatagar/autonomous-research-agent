from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_texts(texts):
    return model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)

def cosine_search(query_embedding, embeddings, top_k=10):
    scores = embeddings @ query_embedding
    top_indices = np.argsort(scores)[::-1][:top_k]
    return top_indices, scores[top_indices]