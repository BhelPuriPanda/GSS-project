# Goalcast Node.js Backend

This is the Express.js backend for the Goalcast application, primarily handling user authentication and basic user management. It features a robust setup including MongoDB integration, JWT-based authentication, and rate limiting.

## Features

- **Authentication System**: Secure signup, login, password recovery, and OTP generation.
- **Media Storage**: Built-in multipart file upload handling via `multer` allowing up to 50MB uploads (configured in `storageService.js`).
- **Security best practices**: Utilizing libraries like `bcrypt` for hashing, `express-rate-limit` for limiting API hits, and CORS.
- **Error Handling**: Custom robust global error handling middleware via `express-async-errors`.
- **JWT Support**: Secure JSON Web Token implementation for authenticated routes.

## Project Structure

```text
backend-node/
├── controllers/      # Handles incoming requests and orchestrates logic (e.g., authController.js)
├── middleware/       # Custom Express middleware (errorHandler, validateRequest, authMiddleware)
├── models/           # Mongoose schemas representing database structures (userModel, OTP)
├── routes/           # Express routers directing requests to appropriate controllers (authRoutes)
├── services/         # Dedicated logic integrations, such as `storageService.js` handling `multer` logic for media APIs
├── utils/            # Utility handlers for distinct components (logger.js, AppError.js, mailSender.js)
└── app.js            # Main Express application entry point where middlewares and routes are connected
```

## Setup & Installation

1. **Install Dependencies:**
   Ensure you have Node.js installed, then navigate to this directory and install dependencies:
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root of the `backend-node` directory (same level as `app.js`) and provide the environment variables:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=your_mongodb_connection_string
   OPENROUTER_API_KEY=your_openrouter_api_key_for_ai
   ```
   *(Note: Ensure your `config/db.js` properly points to your MongoDB connection variable.)*

3. **Start the Development Server:**
   You can start the backend up by running the server file:
   ```bash
   node app.js
   ```
   *(We recommend using `nodemon` or standard npm scripts if configured for the project).*

## API Endpoints

### Authentication (`/api/auth`)

These routes handle all critical authentication states such as onboarding and credential validation.

- **`POST /api/auth/signup`**
  Registers a new user into the database. Requires `fullName`, `uniqueId`, `email`, `password`, `otp`, `publicKey`, and `encryptedPrivateKey`. Validates the submitted OTP.

- **`POST /api/auth/login`**
  Authenticates an existing user and retrieves a JWT via a cookie/payload for protected routes using `uniqueId` or `email` as well as their `password`.

- **`POST /api/auth/sendotp`**
  Generates a 6-digit OTP to the registered user's email securely for two-factor verification.

- **`POST /api/auth/forgot-password`**
  Initiates the password reset flow. Requires `email` and dispatches an OTP.

- **`POST /api/auth/reset-password`**
  Concludes the password reset loop by validating the provided `otp` and setting a `newPassword`. Requires `email`, `otp`, and `newPassword`.

### Media (`/api/media`)

- **`POST /api/media/upload`**
  Upload a new media asset for protection.
- **`GET /api/media/me`**
  Get all protected original media assets for the logged-in user.
- **`GET /api/media/all`**
  Get all protected original media across the entire system.
- **`POST /api/media/report`**
  Report a newly found infringement/violation (Fired by Scraper Node).
- **`GET /api/media/violations/me`**
  Get all violations specific to the logged-in user.

### AI Assistant (`/api/ai`)

- **`POST /api/ai/analyze`**
  Generates a strategic, actionable legal step for handling a specific digital piracy violation using OpenRouter. Requires `violationTitle`, `sourceUrl`, and `matchedTitle`. Integrates with the Google Gemma suite natively. Requires `OPENROUTER_API_KEY` in `.env`.
