from search.search import search
from search.scrape import scrape
from utils.text_cleaning import clean_text

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