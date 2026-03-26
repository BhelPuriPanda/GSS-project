import os
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.config import UPLOAD_DIR
from app.utils.helpers import ensure_dir

async def save_upload_file(upload_file: UploadFile) -> str:
    ensure_dir(UPLOAD_DIR)
    suffix = Path(upload_file.filename or "").suffix
    temp_name = f"{uuid.uuid4().hex}{suffix}"
    temp_path = UPLOAD_DIR / temp_name

    content = await upload_file.read()
    with open(temp_path, "wb") as f:
        f.write(content)

    return str(temp_path)

def remove_file(file_path: str) -> None:
    try:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
    except Exception:
        pass