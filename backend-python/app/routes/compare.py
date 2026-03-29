import json
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.core.logger import get_logger
from app.services.image_hash import generate_hashes
from app.services.embedding import generate_embedding
from app.services.similarity import compare_fingerprints
from app.services.video_processor import extract_video_fingerprints, compare_video_frames
from app.utils.file_handler import save_upload_file, remove_file
from app.utils.helpers import parse_json_list

router = APIRouter(prefix="/compare", tags=["Compare"])
logger = get_logger(__name__)


@router.post("/image")
async def compare_image(
    file: UploadFile = File(...),
    target_phash: Optional[str] = Form(None),
    target_embedding: Optional[str] = Form(None),
):
    temp_path = await save_upload_file(file)

    try:
        hashes = generate_hashes(temp_path)
        embedding = generate_embedding(temp_path)

        # ✅ Generation mode
        if not target_phash and not target_embedding:
            return {
                "success": True,
                "media_type": "image",
                "mode": "generate",
                "fingerprint": {
                    "phash": hashes["phash"],
                    "dhash": hashes["dhash"],
                    "embedding": embedding,
                },
                "comparison": None,
            }

        # 🔍 DEBUG (optional)
        print("RAW target_embedding:", target_embedding)

        # ✅ Safe parsing
        try:
            parsed_target_embedding = parse_json_list(target_embedding)
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Invalid target_embedding JSON."
            )

        # ✅ Comparison mode
        comparison = compare_fingerprints(
            source_phash=hashes["phash"],
            source_embedding=embedding,
            target_phash=target_phash,
            target_embedding=parsed_target_embedding,
            media_type="image",
        )

        return {
            "success": True,
            "media_type": "image",
            "mode": "compare",
            "fingerprint": {
                "phash": hashes["phash"],
                "dhash": hashes["dhash"],
                "embedding": embedding,
            },
            "comparison": comparison,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Image compare failed")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        remove_file(temp_path)


@router.post("/video")
async def compare_video(
    file: UploadFile = File(...),
    target_phash: Optional[str] = Form(None),
    target_embedding: Optional[str] = Form(None),
):
    temp_path = await save_upload_file(file)

    try:
        frames = extract_video_fingerprints(temp_path)

        if not frames:
            raise HTTPException(status_code=400, detail="Could not process video.")

        # ✅ Generation mode
        if not target_phash and not target_embedding:
            return {
                "success": True,
                "media_type": "video",
                "mode": "generate",
                "fingerprint": {
                    "frames": frames,
                },
                "comparison": None,
            }

        # 🔍 DEBUG (optional)
        print("RAW target_embedding:", target_embedding)

        # ✅ Safe parsing
        try:
            parsed_target_embedding = parse_json_list(target_embedding)
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Invalid target_embedding JSON."
            )

        # ✅ Comparison mode
        comparison = compare_video_frames(
            source_frames=frames,
            target_phash=target_phash,
            target_embedding=parsed_target_embedding,
        )

        return {
            "success": True,
            "media_type": "video",
            "mode": "compare",
            "fingerprint": {
                "frames": frames,
            },
            "comparison": comparison,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Video compare failed")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        remove_file(temp_path)


@router.post("/two-images")
async def compare_two_images(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...)
):
    temp_path1 = await save_upload_file(file1)
    temp_path2 = await save_upload_file(file2)
    
    try:
        hashes1 = generate_hashes(temp_path1)
        embedding1 = generate_embedding(temp_path1)
        
        hashes2 = generate_hashes(temp_path2)
        embedding2 = generate_embedding(temp_path2)
        
        comparison = compare_fingerprints(
            source_phash=hashes1["phash"],
            source_embedding=embedding1,
            target_phash=hashes2["phash"],
            target_embedding=embedding2,
            media_type="image",
        )
        
        return {
            "success": True,
            "comparison": comparison
        }
    except Exception as e:
        logger.exception("Dual Image compare failed")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        remove_file(temp_path1)
        remove_file(temp_path2)