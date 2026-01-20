from fastapi import APIRouter, HTTPException
from api.schemas import ResearchRequest, ResearchResponse
from services.research_pipeline import run_pipeline

router = APIRouter(prefix="/research", tags=["Research"])

@router.post("/", response_model=ResearchResponse)
def run_research(request: ResearchRequest):
    try:
        result = run_pipeline(request.query)
        return ResearchResponse(response=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
