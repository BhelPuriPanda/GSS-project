# Python Backend Service

## Overview

This is a Python machine learning service built with FastAPI that provides image and video comparison capabilities. The service uses multiple fingerprinting techniques including perceptual hashing (phash), difference hashing (dhash), and CNN-based embeddings to analyze and compare media files.

## Features

- **Image Fingerprinting**: Generate unique fingerprints for images using phash, dhash, and neural network embeddings
- **Image Comparison**: Compare uploaded images against target fingerprints to determine similarity
- **Video Processing**: Extract frames from videos and perform comparison analysis
- **RESTful API**: Clean, documented API endpoints for easy integration
- **CORS Support**: Configured for cross-origin requests

## Tech Stack

- **Framework**: FastAPI
- **Server**: Uvicorn
- **Image Processing**: OpenCV, Pillow
- **Machine Learning**: PyTorch, TorchVision
- **Hashing**: ImageHash library
- **Data Validation**: Pydantic

## Installation

1. Ensure you have Python 3.8+ installed
2. Navigate to the backend-python directory:
   ```bash
   cd backend-python
   ```
3. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Service

Start the development server:
```bash
python run.py
```

The service will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- **GET** `/`
- Returns service status and basic information

**Response**:
```json
{
  "success": true,
  "message": "Python ML Service is running"
}
```

### Image Comparison/Fingerprinting
- **POST** `/compare/image`
- **Parameters**:
  - `file`: Image file to analyze (UploadFile, required)
  - `target_phash`: Target perceptual hash for comparison (optional string)
  - `target_embedding`: Target embedding vector for comparison (optional JSON string)

**Response Modes**:

**Generation Mode** (when no target parameters provided):
Returns fingerprints for the uploaded image
```json
{
  "success": true,
  "media_type": "image",
  "mode": "generate",
  "fingerprint": {
    "phash": "string",
    "dhash": "string",
    "embedding": [array of floats]
  },
  "comparison": null
}
```

**Comparison Mode** (when target parameters provided):
Returns similarity comparison results
```json
{
  "success": true,
  "media_type": "image",
  "mode": "compare",
  "fingerprint": {
    "phash": "string",
    "dhash": "string",
    "embedding": [array of floats]
  },
  "comparison": {
    "phash_similarity": float,
    "embedding_similarity": float,
    "overall_score": float
  }
}
```

### Video Comparison/Fingerprinting
- **POST** `/compare/video`
- **Parameters**:
  - `file`: Video file to analyze (UploadFile, required)
  - `target_phash`: Target perceptual hash for comparison (optional string)
  - `target_embedding`: Target embedding vector for comparison (optional JSON string)

**Response Modes**:

**Generation Mode** (when no target parameters provided):
Returns fingerprints for video frames
```json
{
  "success": true,
  "media_type": "video",
  "mode": "generate",
  "fingerprint": {
    "frames": [
      {
        "frame_number": int,
        "phash": "string",
        "dhash": "string",
        "embedding": [array of floats]
      }
    ]
  },
  "comparison": null
}
```

**Comparison Mode** (when target parameters provided):
Returns similarity comparison results for video frames
```json
{
  "success": true,
  "media_type": "video",
  "mode": "compare",
  "fingerprint": {
    "frames": [
      {
        "frame_number": int,
        "phash": "string",
        "dhash": "string",
        "embedding": [array of floats]
      }
    ]
  },
  "comparison": {
    "best_match": {
      "frame_number": int,
      "phash_similarity": float,
      "embedding_similarity": float,
      "overall_score": float
    },
    "average_similarity": float
  }
}
```

## Project Structure

```
backend-python/
├── app/
│   ├── main.py              # FastAPI application setup
│   ├── config.py            # Configuration settings
│   ├── core/
│   │   └── logger.py        # Logging configuration
│   ├── models/
│   │   └── cnn_model.py     # CNN model definitions
│   ├── routes/
│   │   └── compare.py       # API routes for comparison
│   ├── schemas/
│   │   └── request_response.py  # Pydantic schemas
│   ├── services/
│   │   ├── embedding.py     # Embedding generation service
│   │   ├── image_hash.py    # Hash generation service
│   │   ├── similarity.py    # Similarity calculation service
│   │   └── video_processor.py  # Video processing service
│   └── utils/
│       ├── file_handler.py  # File upload handling
│       └── helpers.py       # Utility functions
├── tests/                   # Unit tests
├── uploads/                 # Temporary upload directory
├── requirements.txt         # Python dependencies
├── run.py                   # Application entry point
└── README.md               # This file
```

## Configuration

Key configuration options in `app/config.py`:
- `UPLOAD_DIR`: Directory for temporary file storage
- `MODEL_PATH`: Path to pre-trained CNN model (if applicable)

## Development

### Running Tests
```bash
python -m pytest tests/
```

### Code Style
Follow PEP 8 guidelines. Use tools like `black` and `flake8` for code formatting and linting.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add license information if applicable]
