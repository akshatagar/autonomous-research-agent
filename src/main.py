from search.search import search
from search.scrape import scrape
from utils.text_cleaning import clean_text
from utils.chunking import create_chunks
from utils.embeddings import embed_texts, cosine_search
from sklearn.cluster import KMeans
from utils.summarizer import summarize

def research_agent(query):
    urls = search(query)
    contents = scrape(urls)
    return contents

query = "Latest advancements in renewable energy technology"
docs = research_agent(query)
for doc in docs:
    doc['text'] = clean_text(doc['text'])
docs = [d for d in docs if d["text"]]
# print(f"Found {len(docs)} relevant documents after cleaning.\n")

for doc in docs:
    chunks = create_chunks(doc['text'])
    doc['chunks'] = chunks
    # print(f"Document URL: {doc['url']}")
    # print(f"Number of chunks created: {len(chunks)}\n")

all_chunks = []
metadata = []

i = 0
for doc in docs:
    for chunk in doc["chunks"]:
        all_chunks.append(chunk)
        metadata.append({
            "url": doc["url"],
            "title": doc["title"],
            "chunk_index": i
        })
        i += 1

chunk_embeddings = embed_texts(all_chunks)
query_embedding = embed_texts([query])[0]

top_idxs, scores = cosine_search(query_embedding, chunk_embeddings)

# for idx, score in zip(top_idxs, scores):
#     print(f"\nScore: {score:.3f}")
#     print(f"Title: {metadata[idx]['title']}")
#     print(f"Source: {metadata[idx]['url']}")
#     print(all_chunks[idx][:300], "...")

top_chunk_embeddings = chunk_embeddings[top_idxs]
top_chunks = [metadata[i] for i in top_idxs]

num_clusters = 4
clustering_model = KMeans(n_clusters=num_clusters)
clustering_model.fit(top_chunk_embeddings)
cluster_assignment = clustering_model.labels_

clusters = [[] for i in range(num_clusters)]
for chunk_id, cluster_id in enumerate(cluster_assignment):
    chunk = top_chunks[chunk_id]
    clusters[cluster_id].append((chunk_id, scores[chunk_id]))

# for i, cluster in enumerate(clusters):
#     print("Cluster ", i + 1)
#     print(cluster)
#     print("")

prompt = """
Given the following passages, which all discuss related aspects of a broader topic: 
1) Identify the single main theme that connects them.
2) Produce a short, specific title (max 8 words).
3) Write a 3-5 sentence summary capturing the core ideas.
Do not introduce information that is not present in the passages.
Avoid repeating the same idea in different wording.
"""

for i, cluster in enumerate(clusters):
    cluster.sort(key=lambda x: x[1], reverse=True)
    clusters[i] = cluster[:3]
    clusters[i] = list(map(lambda x: f"\n{top_chunks[x[0]]['title']}:\n{all_chunks[top_chunks[x[0]]['chunk_index']]}", clusters[i]))
    clusters[i] = "\n\n".join(clusters[i])
    clusters[i] = summarize(clusters[i], prompt)
    print(f"\n=== Cluster {i + 1} Summary ===")
    print(clusters[i])

