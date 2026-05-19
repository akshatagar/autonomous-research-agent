from pydantic import BaseModel

class ClustersRequest(BaseModel):
    query: str

class ClustersResponse(BaseModel):
    response: list

class ReportRequest(BaseModel):
    clusters: list

class ReportResponse(BaseModel):
    response: str
