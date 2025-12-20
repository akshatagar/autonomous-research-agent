import requests
from readability import Document
from bs4 import BeautifulSoup

BAD_MARKERS = [
    "enable javascript",
    "turn on javascript",
    "requires javascript",
    "enable cookies",
    "403",
    "forbidden",
    "access denied",
    "there was a problem providing the content you requested"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ResearchAgent/1.0)"
}


def extract_text(url):
    resp = requests.get(url, headers=HEADERS, timeout=5)
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
            if any(marker in content["text"].lower() for marker in BAD_MARKERS) \
            or len(content["text"].strip()) == 0:
                continue
            results.append(content)
        except Exception as e:
            continue
    return results
