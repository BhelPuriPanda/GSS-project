import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

# Similarity thresholds
COSINE_THRESHOLD = float(os.getenv("COSINE_THRESHOLD", "0.85"))
Hamming_THRESHOLD_IMAGE = int(os.getenv("HAMMING_THRESHOLD_IMAGE", "10"))
HAMMING_THRESHOLD_VIDEO = int(os.getenv("HAMMING_THRESHOLD_VIDEO", "15"))

# Video frame extraction
VIDEO_FRAME_STEP = int(os.getenv("VIDEO_FRAME_STEP", "30"))  # every 30th frame

# Upload limits
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "100"))