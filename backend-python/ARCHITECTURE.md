# Python Machine Learning Architecture

The Python backend is an incredibly lightweight, stateless mathematical verification engine strictly dedicated to performing spatial hashing and multi-dimensional image embedding extraction.

## Core Processors

### 1. Perceptual and Difference Hashing (`pHash` / `dHash`)
Uses `ImageHash` and Pillow. 
These are structural hashes that determine the exact visual layout of the image. Small localized edits (like a watermark or slight crop) will not alter the pHash significantly. The Backend Node uses these primarily for perfect 1:1 database lookups to prevent duplicate original uploads.

### 2. Deep Deep Learning Embeddings (`torchvision.models.resnet50`)
When a suspect image is pulled by the Scraper, the exact spatial hash is usually degraded due to the pirate heavily cropping, filtering, or compressing the image.
To solve this, the Python engine utilizes a **pre-trained ResNet-50** engine to generate a **512-dimensional vector embedding**.

It evaluates the mathematical distance between the suspect's 512-vector array against the True Original's 512-vector array using **Cosine Similarity**:
```python
cosine_similarity = float(F.cosine_similarity(t1, t2).item())
```
If the threshold clears `0.90` (90%), the Python engine officially declares the suspect image a Stolen Asset and alerts the Scraper to report it.

### Server Deployment (`FastAPI`)
The Python server exposes two standard endpoints:
- `POST /compare/image`
- `POST /compare/video`

It expects `multipart/form-data` containing the raw `file` buffer, and the 512-dimensional `target_embedding` array passed entirely through a stringified JSON key to execute the Cosine Similarity mathematically in RAM.
