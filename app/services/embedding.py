from typing import List

import numpy as np
import torch
from PIL import Image

from app.models.cnn_model import get_model, get_preprocess

def generate_embedding(image_path: str) -> List[float]:
    model = get_model()
    preprocess = get_preprocess()

    image = Image.open(image_path).convert("RGB")
    tensor = preprocess(image).unsqueeze(0)

    with torch.no_grad():
        embedding = model(tensor).squeeze(0).cpu().numpy()

    return embedding.astype(np.float32).tolist()