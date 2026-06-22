# Autonomous Research Agent

An end-to-end AI research platform that searches the web, extracts and clusters relevant content, and generates structured executive-level research reports, with user accounts and persistent report history.

---

## How it works

Given a natural-language research question, the system:

1. Searches the web for recent, relevant sources (Tavily API)
2. Scrapes and cleans article text from each URL
3. Splits long documents into overlapping semantic chunks
4. Embeds chunks and the query into a shared vector space (OpenAI Embeddings)
5. Retrieves the most relevant chunks using cosine similarity
6. Clusters related chunks using K-Means
7. Presents topic clusters to the user for selection
8. Summarizes selected clusters and synthesizes an **Executive Research Brief**

---

## Features

- **Semantic retrieval** — cosine similarity over OpenAI embeddings, not keyword matching
- **Unsupervised clustering (K-Means)** — groups related ideas without predefined labels
- **Multi-stage LLM summarization** — cluster-level synthesis followed by executive synthesis
- **User accounts** — register, log in, JWT-authenticated sessions
- **Report history** — all generated reports saved per user, accessible from the dashboard
- **React frontend** — topic selection UI, markdown report rendering, history panel

---

## Tech Stack

| Layer            | Technology                |
| ---------------- | ------------------------- |
| Frontend         | React 18, Vite            |
| Backend          | FastAPI                   |
| Database         | PostgreSQL, SQLAlchemy    |
| Auth             | JWT (python-jose), bcrypt |
| LLM & Embeddings | OpenAI API                |
| Web Search       | Tavily API                |
| Scraping         | BeautifulSoup             |
| Clustering       | scikit-learn (K-Means)    |
| Containerization | Docker, Docker Compose    |

---

## Project Structure

```
autonomous-research-agent/
├── docker-compose.yml            # Orchestrates backend + Postgres
├── .env.example                  # Required environment variables
├── backend/
│   ├── dockerfile                # Backend container image
│   ├── main.py                   # FastAPI app entry point
│   ├── api/
│   │   ├── auth.py               # /auth/register, /auth/login
│   │   ├── routes.py             # /research/clusters, /report, /reports
│   │   ├── schemas.py            # Pydantic request/response models
│   │   ├── deps.py               # get_current_user dependency
│   │   └── security.py           # JWT + bcrypt helpers
│   ├── db/
│   │   ├── database.py           # SQLAlchemy engine & session
│   │   └── models.py             # User, Report ORM models
│   ├── services/
│   │   └── research_pipeline.py  # Cluster + report generation logic
│   ├── search/
│   │   ├── search.py             # Tavily web search
│   │   └── scrape.py             # URL scraping & cleaning
│   └── utils/
│       ├── agent.py              # LLM calls (OpenAI)
│       ├── embeddings.py         # Embedding generation
│       ├── chunking.py           # Overlapping chunk splitting
│       └── text_cleaning.py      # Boilerplate removal
└── frontend/
    └── src/
        ├── App.jsx               # Main app shell + routing logic
        ├── LoginPage.jsx         # Login / register form
        ├── ReportDisplay.jsx     # Markdown report renderer
        └── api.js                # Fetch wrappers for all endpoints
```

---

## Author

**Akshat Agarwal**
AI / Machine Learning — Full-Stack AI Systems
Focused on building end-to-end intelligent research and decision-support systems
