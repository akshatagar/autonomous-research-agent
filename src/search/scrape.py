import requests
from readability import Document
from bs4 import BeautifulSoup

def extract_text(url):
    resp = requests.get(url, timeout=5)
    html = resp.text
    doc = Document(html)
    title = doc.title()
    summary_html = doc.summary()
    soup = BeautifulSoup(summary_html, 'html.parser')
    text = soup.get_text(separator='\n\n')
    return {
        "url": url,
        "title": title,
        "text": text
    }

def scrape(urls):
    results = []
    for url in urls:
        try:
            content = extract_text(url)
            results.append(content)
        except Exception as e:
            print(f"Failed to scrape {url}: {e}")
    return results
