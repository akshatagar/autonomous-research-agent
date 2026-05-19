from fastapi import APIRouter, HTTPException
from api.schemas import ClustersRequest, ClustersResponse, ReportRequest, ReportResponse
from services.research_pipeline import create_clusters, create_report

router = APIRouter(prefix="/research", tags=["Research"])

@router.post("/clusters", response_model=ClustersResponse)
def get_clusters(request: ClustersRequest):
    try:
        result = create_clusters(request.query)
        return ClustersResponse(response=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/report", response_model=ReportResponse)
def get_report(request: ReportRequest):
    try:
        result = create_report(request.clusters)
        return ReportResponse(response=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
