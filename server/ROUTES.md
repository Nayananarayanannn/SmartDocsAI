# Server Routes Documentation

This document outlines all available API endpoints for the SmartDocsAI server.

## Base URL

```
http://localhost:{PORT}/api
```

## Endpoints

### 1. Health Check

- **URL**: `/`
- **Method**: `GET`
- **Description**: Basic health check to verify the API is running
- **Response**:
  ```
  api is running
  ```

---

### 2. Upload File

- **URL**: `/api/upload`
- **Method**: `POST`
- **Description**: Upload a file (PDF or other supported format) to be processed and stored in the database
- **Headers**:
  - `Content-Type`: `multipart/form-data`
- **Body Parameters**:
  - `file` (required): File to upload (single file only)
- **Response**:
  ```json
  {
    "success": true,
    "message": "File processed successfully",
    "data": {
      "fileId": "string",
      "fileName": "string",
      "uploadedAt": "ISO 8601 date string"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

---

### 3. Chat Question

- **URL**: `/api/chat`
- **Method**: `POST`
- **Description**: Submit a question and receive a response based on uploaded documents. Uses Google Generative AI for intelligent responses.
- **Headers**:
  - `Content-Type`: `application/json`
- **Body Parameters**:
  ```json
  {
    "question": "string (required)",
    "fileId": "string (optional)",
    "conversationHistory": "array (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Response generated successfully",
    "data": {
      "answer": "string",
      "sources": ["array of referenced documents"],
      "timestamp": "ISO 8601 date string"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

---

## Middleware

### CORS

- Cross-Origin Resource Sharing is enabled for all routes
- Allows requests from any origin

### File Upload

- Uses `multer` middleware for file upload handling
- Accepts single file uploads in the `file` field
- Supported file types: PDF (and others configured in middleware)

### Request Logging

- All incoming requests are logged with their HTTP method and URL
- Format: `{METHOD} {URL}`

---

## Technologies Used

- **Framework**: Express.js 5.2.1
- **File Upload**: Multer 2.1.1
- **PDF Processing**: pdf-parse 2.4.5
- **Database**: MongoDB with Mongoose 9.6.2
- **AI**: Google Generative AI 0.24.1
- **CORS**: cors 2.8.6

---

## Setup & Running

### Install Dependencies

```bash
npm install
```

### Start Server

**Development** (with auto-reload):

```bash
npm run dev
```

**Production**:

```bash
npm start
```

### Environment Variables

Create a `.env` file in the server directory with:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_google_generative_ai_key
```

---

## Example Usage

### Upload a PDF

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@document.pdf"
```

### Ask a Question

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the main topic of this document?",
    "fileId": "file_id_here"
  }'
```

---

## Error Handling

All errors return a standardized error response with:

- `success`: `false`
- `message`: Description of the error

Common HTTP Status Codes:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes

- File uploads are processed using `pdf-parse` to extract text content
- Questions are answered using Google's Generative AI model
- Document chunks are stored in MongoDB for retrieval and context
- The server uses ES6 modules (type: "module" in package.json)
