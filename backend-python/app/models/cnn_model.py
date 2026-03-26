from functools import lru_cache

import torch
from torchvision.models import resnet18, ResNet18_Weights

@lru_cache(maxsize=1)
def get_model():
    weights = ResNet18_Weights.DEFAULT
    model = resnet18(weights=weights)
    model.fc = torch.nn.Identity()
    model.eval()
    return model

def get_preprocess():
    weights = ResNet18_Weights.DEFAULT
    return weights.transforms()