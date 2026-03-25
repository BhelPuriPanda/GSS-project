import json
from pathlib import Path
from typing import Optional, List


def ensure_dir(path: Path) -> None:
    """
    Create directory if it doesn't exist.
    """
    path.mkdir(parents=True, exist_ok=True)


def parse_json_list(value: Optional[str]) -> Optional[List[float]]:
    """
    Safely parse a JSON string into a Python list of floats.
    Handles Swagger issues like:
    - multiline JSON
    - extra spaces
    - quoted JSON strings
    """
    if value is None:
        return None

    value = value.strip()

    if value == "":
        return None

    # If already a list (rare but safe)
    if isinstance(value, list):
        return value

    # 🔥 Remove wrapping quotes (Swagger bug fix)
    if value.startswith('"') and value.endswith('"'):
        value = value[1:-1]

    # 🔥 Clean unwanted characters
    value = value.replace("\n", "").replace("\r", "").strip()

    try:
        return json.loads(value)
    except Exception:
        raise ValueError(f"Invalid JSON format for embedding: {value[:50]}...")


def parse_json_string(value: Optional[str]) -> Optional[str]:
    """
    Safely parse string inputs.
    """
    if value is None:
        return None

    value = value.strip()

    if value == "":
        return None

    return str(value)