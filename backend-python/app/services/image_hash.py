from PIL import Image
import imagehash

def generate_hashes(image_path: str) -> dict:
    image = Image.open(image_path).convert("RGB")
    phash = str(imagehash.phash(image))
    dhash = str(imagehash.dhash(image))
    return {
        "phash": phash,
        "dhash": dhash,
    }

def hex_hamming_distance(hash1: str, hash2: str) -> int:
    """
    Works for same-length hexadecimal hash strings.
    """
    if not hash1 or not hash2:
        return 999999

    # Convert hex to integer and count bit differences
    return bin(int(hash1, 16) ^ int(hash2, 16)).count("1")