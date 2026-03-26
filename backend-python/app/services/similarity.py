from typing import List, Optional, Tuple
import numpy as np

from app.services.image_hash import hex_hamming_distance
from app.config import COSINE_THRESHOLD, Hamming_THRESHOLD_IMAGE, HAMMING_THRESHOLD_VIDEO

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    if not vec1 or not vec2:
        return 0.0

    a = np.array(vec1, dtype=np.float32)
    b = np.array(vec2, dtype=np.float32)

    if a.shape != b.shape:
        return 0.0

    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0

    return float(np.dot(a, b) / denom)

def compare_fingerprints(
    source_phash: Optional[str],
    source_embedding: Optional[List[float]],
    target_phash: Optional[str],
    target_embedding: Optional[List[float]],
    media_type: str = "image",
) -> dict:
    ham_threshold = Hamming_THRESHOLD_IMAGE if media_type == "image" else HAMMING_THRESHOLD_VIDEO

    hamming_distance = None
    cosine = None

    if source_phash and target_phash:
        hamming_distance = hex_hamming_distance(source_phash, target_phash)

    if source_embedding is not None and target_embedding is not None:
        cosine = cosine_similarity(source_embedding, target_embedding)

    match = False

    # Stronger hybrid rule: reduce false positives
    if cosine is not None and hamming_distance is not None:
        match = (cosine >= 0.92) or (cosine >= COSINE_THRESHOLD and hamming_distance <= ham_threshold)
    elif cosine is not None:
        match = cosine >= 0.92
    elif hamming_distance is not None:
        match = hamming_distance <= ham_threshold

    return {
        "match": match,
        "cosine_similarity": cosine,
        "hamming_distance": hamming_distance,
        "thresholds": {
            "cosine_threshold": COSINE_THRESHOLD,
            "hamming_threshold": ham_threshold,
        },
    }