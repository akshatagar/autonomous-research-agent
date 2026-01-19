from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.api import ResearchResponse, ResearchRequest

app = FastAPI(
    title="Autonomous Research Agent",
    description="api to generate research reports",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return { "status": "ok" }

@app.post("/research", response_model=ResearchResponse)
def research(req: ResearchRequest):
    return ResearchResponse(
        response=f"Stubbed research response for query: {req.query}"
    )

