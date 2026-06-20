from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from api.schemas import ClustersRequest, ClustersResponse, ReportRequest, ReportResponse, ReportHistoryItem
from api.deps import get_current_user
from db.database import get_db
from db.models import User, Report
from services.research_pipeline import create_clusters, create_report

router = APIRouter(prefix="/research", tags=["Research"])

@router.post("/clusters", response_model=ClustersResponse)
def get_clusters(request: ClustersRequest, user: User = Depends(get_current_user)):
    try:
        result = create_clusters(request.query)
        return ClustersResponse(response=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/report", response_model=ReportResponse)
def get_report(
    request: ReportRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = create_report(request.clusters)
        report = Report(user_id=user.id, query=request.query or "", content=result)
        db.add(report)
        db.commit()
        return ReportResponse(response=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports", response_model=List[ReportHistoryItem])
def list_reports(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reports = (
        db.query(Report)
        .filter(Report.user_id == user.id)
        .order_by(Report.created_at.desc())
        .all()
    )
    return [
        ReportHistoryItem(
            id=r.id,
            query=r.query,
            content=r.content,
            created_at=r.created_at.isoformat(),
        )
        for r in reports
    ]
