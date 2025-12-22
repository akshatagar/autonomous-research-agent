from search.search import search
from search.scrape import scrape
from utils.text_cleaning import clean_text
from utils.chunking import create_chunks

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

