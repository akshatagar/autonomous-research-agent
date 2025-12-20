from tavily import TavilyClient
from dotenv import load_dotenv
import os
load_dotenv()

api_key = os.getenv("TAVILY_API_KEY")
tavily_client = TavilyClient(api_key=api_key)

def search(query):
    response = tavily_client.search(query=query, max_results=15)
    urls = [result["url"] for result in response["results"]]
    return urls
