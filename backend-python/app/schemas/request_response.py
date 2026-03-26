from typing import Optional, List, Any, Dict
from pydantic import BaseModel

class FingerprintResponse(BaseModel):
    phash: str
    dhash: str
    embedding: List[float]

class CompareResponse(BaseModel):
    success: bool
    media_type: str
    mode: str
    fingerprint: Optional[Dict[str, Any]] = None
    comparison: Optional[Dict[str, Any]] = None