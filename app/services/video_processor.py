from typing import List, Dict, Any
import cv2

from app.config import VIDEO_FRAME_STEP
from app.services.image_hash import generate_hashes
from app.services.embedding import generate_embedding

def extract_video_fingerprints(video_path: str) -> List[Dict[str, Any]]:
    """
    Extract fingerprints from key frames of a video.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []

    fingerprints = []
    frame_index = 0

    while True:
        success, frame = cap.read()
        if not success:
            break

        if frame_index % VIDEO_FRAME_STEP == 0:
            temp_frame_path = f"{video_path}_frame_{frame_index}.jpg"
            cv2.imwrite(temp_frame_path, frame)

            hashes = generate_hashes(temp_frame_path)
            embedding = generate_embedding(temp_frame_path)

            fingerprints.append({
                "frame_index": frame_index,
                "phash": hashes["phash"],
                "dhash": hashes["dhash"],
                "embedding": embedding,
            })

            try:
                import os
                if os.path.exists(temp_frame_path):
                    os.remove(temp_frame_path)
            except Exception:
                pass

        frame_index += 1

    cap.release()
    return fingerprints

def compare_video_frames(
    source_frames: List[Dict[str, Any]],
    target_phash: str | None,
    target_embedding: list[float] | None,
) -> dict:
    """
    Compare all extracted frames to a target fingerprint and return best match.
    """
    from app.services.similarity import compare_fingerprints

    best_result = {
        "match": False,
        "best_cosine_similarity": None,
        "best_hamming_distance": None,
        "best_frame_index": None,
    }

    best_score = -1.0

    for frame in source_frames:
        result = compare_fingerprints(
            source_phash=frame.get("phash"),
            source_embedding=frame.get("embedding"),
            target_phash=target_phash,
            target_embedding=target_embedding,
            media_type="video",
        )

        cosine = result.get("cosine_similarity") or 0.0
        hamming = result.get("hamming_distance")

        score = cosine
        if hamming is not None:
            score += max(0, 1 - (hamming / 100.0))

        if score > best_score:
            best_score = score
            best_result = {
                "match": result["match"],
                "best_cosine_similarity": result["cosine_similarity"],
                "best_hamming_distance": result["hamming_distance"],
                "best_frame_index": frame.get("frame_index"),
            }

    return best_result