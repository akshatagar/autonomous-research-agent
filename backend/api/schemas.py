from pydantic import BaseModel
from typing import Optional

class ClustersRequest(BaseModel):
    query: str

class ClustersResponse(BaseModel):
    response: list

class ReportRequest(BaseModel):
    clusters: list
    query: Optional[str] = ""

class ReportResponse(BaseModel):
    response: str

class ReportHistoryItem(BaseModel):
    id: int
    query: str
    content: str
    created_at: str
