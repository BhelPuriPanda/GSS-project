# Backend API Documentation (Frontend Integration Guide)

Welcome Frontend Developer! This document details the exact REST API endpoints, authentication mechanisms, and JSON schemas you need to build the React application against this Node.js architecture.

## 1. Authentication (`/api/auth`)
The backend uses **JWT (JSON Web Tokens)**. You must store the token (e.g., in `localStorage`) and attach it as a `Bearer` token in the `Authorization` header for all protected routes.

### `POST /api/auth/register` (Fast Register)
Creates a new user account instantly.
- **Payload (JSON):** 
  ```json
  {
    "name": "Creator Name",
    "email": "creator@example.com",
    "password": "securepassword"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUz...",
    "user": { "_id": "...", "fullName": "Creator Name", "email": "creator@example.com" }
  }
  ```

### `POST /api/auth/login`
Authenticates an existing user.
- **Payload (JSON):** 
  ```json
  {
    "uniqueId": "creator@example.com",
    "password": "securepassword"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUz..."
  }
  ```

---

## 2. Media Vault (`/api/media`)
All endpoints in this section **REQUIRE** the JWT Bearer token header. They are strictly isolated per-user, meaning you will only ever receive or modify data belonging to the deeply authenticated user.

### `POST /api/media/upload`
Uploads a new digital asset to be encrypted, Fingerprinted via Python, and protected continuously.
- **Headers:** `Content-Type: multipart/form-data`, `Authorization: Bearer <token>`
- **Payload (FormData):**
  - `file`: The physical physical image/video binary.
  - `title`: String (e.g. "My Exclusive Artwork")
  - `type`: String (`'image'` or `'video'`)
- **Response (201 Created):**
  ```json
  {
    "status": "success",
    "data": { "media": { "_id": "abc...", "title": "My Exclusive Artwork" } }
  }
  ```

### `GET /api/media/me`
Retrieves all protected original assets for the currently logged-in user.
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "media": [
        {
          "_id": "69c7e...",
          "title": "Artwork 1",
          "fileUrl": "/uploads/file-123.jpg",
          "isViolation": false
        }
      ]
    }
  }
  ```
*(Note: To display the image on the frontend, prefix `fileUrl` with the backend host, e.g., `http://localhost:5000/uploads/file-123.jpg`)*

### `GET /api/media/violations/me`
Retrieves all **Live Piracy Violations** mapped to the currently logged-in user's assets.
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "media": [
        {
          "_id": "69x...",
          "similarityScore": 0.98,
          "sourceUrl": "https://pinterest.com/pin/12345",
          "matchedWith": {
             "_id": "69c7e...",
             "title": "Artwork 1"
          }
        }
      ]
    }
  }
  ```
*(Here, `matchedWith` is populated automatically so the frontend can tell the user EXACTLY which piece of their art was stolen!)*
