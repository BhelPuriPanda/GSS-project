from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.compare import router as compare_router
from app.config import UPLOAD_DIR
from app.utils.helpers import ensure_dir

app = FastAPI(title="Python ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    ensure_dir(UPLOAD_DIR)

@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {
        "success": True,
        "message": "Python ML Service is running",
    }

app.include_router(compare_router)