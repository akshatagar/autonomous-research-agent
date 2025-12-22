from search.search import search
from search.scrape import scrape
from utils.text_cleaning import clean_text
from utils.chunking import create_chunks
from utils.embeddings import embed_texts, cosine_search

def research_agent(query):
    urls = search(query)
    contents = scrape(urls)
    return contents

query = "Latest advancements in renewable energy technology"
docs = research_agent(query)
for doc in docs:
    doc['text'] = clean_text(doc['text'])
docs = [d for d in docs if d["text"]]
print(f"Found {len(docs)} relevant documents after cleaning.\n")

for doc in docs:
    chunks = create_chunks(doc['text'])
    doc['chunks'] = chunks
    print(f"Document URL: {doc['url']}")
    print(f"Number of chunks created: {len(chunks)}\n")

all_chunks = []
metadata = []

for doc in docs:
    for i, chunk in enumerate(doc["chunks"]):
        all_chunks.append(chunk)
        metadata.append({
            "url": doc["url"],
            "title": doc["title"],
            "chunk_index": i
        })

chunk_embeddings = embed_texts(all_chunks)

query = "battery storage and energy storage innovations"
query_embedding = embed_texts([query])[0]

top_idxs, scores = cosine_search(query_embedding, chunk_embeddings)

for idx, score in zip(top_idxs, scores):
    print(f"\nScore: {score:.3f}")
    print(f"Title: {metadata[idx]['title']}")
    print(f"Source: {metadata[idx]['url']}")
    print(all_chunks[idx][:300], "...")
