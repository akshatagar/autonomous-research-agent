from search.search import search
from search.scrape import scrape

def research_agent(query):
    urls = search(query)
    contents = scrape(urls)
    return contents

print(research_agent("Latest advancements in renewable energy technology"))