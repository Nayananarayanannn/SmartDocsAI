# SmartDocsAI Server

A powerful Node.js/Express-based RAG (Retrieval-Augmented Generation) API server that enables intelligent document processing and AI-powered question answering. Upload PDF documents, process them with semantic understanding, and get accurate answers using Google's Generative AI.

## 🎯 Project Overview

SmartDocsAI Server is the backend component of the SmartDocsAI application. It provides RESTful APIs for:

- **Document Processing**: Upload and parse PDF files with automatic text extraction
- **Semantic Chunking**: Intelligently split large documents into overlapping chunks for better context understanding
- **Embedding Generation**: Convert text to vector embeddings using Google's Embedding Model
- **Vector Search**: Perform semantic similarity search on document chunks using MongoDB Atlas Vector Search
- **AI-Powered Q&A**: Answer questions about uploaded documents using Google's Gemini LLM with context from vector search

This is an implementation of the **RAG (Retrieval-Augmented Generation)** pattern, which combines document retrieval with large language models for accurate, context-aware responses.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Architecture & Workflow](#architecture--workflow)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

✅ **PDF Upload & Processing**

- Support for PDF file uploads (max 10MB)
- Automatic text extraction from PDFs
- Multer integration for efficient file handling

✅ **Intelligent Text Chunking**

- Semantic-aware text splitting (700-character chunks with 100-character overlap)
- Paragraph-aware chunking to maintain context continuity
- Configurable chunk size and overlap for optimal performance

✅ **Vector Embeddings**

- Integration with Google Generative AI Embedding Model (`gemini-embedding-001`)
- Automatic embedding generation for all document chunks
- Vector storage in MongoDB for fast retrieval

✅ **Semantic Search**

- MongoDB Atlas Vector Search (`$vectorSearch`) for similarity matching
- Top-5 most relevant chunks retrieved per query
- 100 candidate search for comprehensive coverage

✅ **AI-Powered Q&A**

- Integration with Google Gemini 2.5 Flash LLM
- Context-aware answer generation
- Graceful fallback: "I don't know" response when answer not in context
- Prevents hallucination by limiting responses to provided context

✅ **CORS Support**

- Cross-origin requests enabled for all routes
- Frontend integration-ready

---

## 🛠 Tech Stack

| Category           | Technology           | Version |
| ------------------ | -------------------- | ------- |
| **Runtime**        | Node.js              | Latest  |
| **Framework**      | Express.js           | 5.2.1   |
| **Database**       | MongoDB + Mongoose   | 9.6.2   |
| **AI/ML**          | Google Generative AI | 0.24.1  |
| **File Upload**    | Multer               | 2.1.1   |
| **PDF Processing** | pdf-parse            | 2.4.5   |
| **CORS**           | cors                 | 2.8.6   |
| **Environment**    | dotenv               | 17.4.2  |
| **Dev Tools**      | Nodemon              | 3.1.14  |
| **Module System**  | ES6 Modules          | -       |

---

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/
│   ├── uploadController.js   # File upload & processing logic
│   └── chatController.js     # Query & answer logic
├── middleware/
│   └── fileUpload.js         # Multer configuration for file uploads
├── models/
│   └── chunk.js              # MongoDB Chunk schema (text + embedding)
├── routes/
│   ├── uploadRoutes.js       # POST /api/upload endpoint
│   └── chatRoutes.js         # POST /api/chat endpoint
├── services/
│   └── aiServices.js         # Google Generative AI integration (embeddings)
├── utils/
│   └── chunkText.js          # Text chunking algorithm
├── server.js                 # Express app setup & middleware
├── package.json              # Dependencies & scripts
├── .env                      # Environment variables (not committed)
└── README.md                 # This file
```

### File Responsibilities

| File                              | Purpose                                                           |
| --------------------------------- | ----------------------------------------------------------------- |
| `server.js`                       | Express app initialization, route mounting, middleware setup      |
| `config/db.js`                    | MongoDB Mongoose connection                                       |
| `controllers/uploadController.js` | Handle PDF upload, extraction, chunking, and embedding generation |
| `controllers/chatController.js`   | Handle user queries, vector search, and AI response generation    |
| `middleware/fileUpload.js`        | Multer configuration for memory-based file storage (10MB limit)   |
| `models/chunk.js`                 | MongoDB schema with `text` and `embedding` (vector) fields        |
| `services/aiServices.js`          | Google AI API calls for generating embeddings                     |
| `utils/chunkText.js`              | Semantic text splitting with overlap support                      |

---

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (cloud database)
- Google Cloud API key with Generative AI access

### Step 1: Clone & Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Google Generative AI Configuration
GEMINI_API_KEY=your_google_generative_ai_api_key_here
```

**How to get credentials:**

1. **MongoDB URI**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and database
   - Get connection string from "Connect" button

2. **GEMINI_API_KEY**:
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
   - Create a new API key
   - Copy and paste into `.env`

### Step 3: Verify Installation

```bash
npm install
npm start
# Should output: "Server is running on port 5000"
```

---

## ⚙️ Configuration

### Environment Variables Reference

```bash
PORT                    # Server port (default: 5000)
MONGO_URI               # MongoDB connection string
GEMINI_API_KEY          # Google Generative AI API key
```

### Tunable Parameters

Located in `utils/chunkText.js`:

```javascript
const CHUNK_SIZE = 700; // Maximum characters per chunk
const OVERLAP = 100; // Overlap between consecutive chunks (in words)
```

**Recommendation**:

- **CHUNK_SIZE**: 500-1000 chars (balance between context and retrieval speed)
- **OVERLAP**: 20-100 words (maintains context continuity across chunks)

### Vector Search Configuration

Located in `controllers/chatController.js`:

```javascript
{
  index: "vector_index",       // MongoDB vector index name
  numCandidates: 100,          // Number of candidates to evaluate
  limit: 5,                    // Top-5 most relevant chunks
}
```

**Note**: Requires MongoDB Atlas Vector Search index named `vector_index` on the `chunks` collection.

---

## 🚀 Usage

### Starting the Server

**Development Mode** (with auto-reload):

```bash
npm run dev
```

**Production Mode**:

```bash
npm start
```

Server will start on the configured PORT (default: 5000).

---

## 📡 API Endpoints

### 1. Health Check

```http
GET /
```

**Response**: `api is running`

---

### 2. Upload File

```http
POST /api/upload
Content-Type: multipart/form-data
```

**Request**:

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@document.pdf"
```

**Parameters**:

- `file` (required): PDF file (max 10MB)

**Response** (Success):

```json
{
  "message": "File uploaded and processed successfully"
}
```

**Response** (Error):

```json
{
  "message": "No file uploaded"
}
```

**Process Flow**:

1. Receive PDF file
2. Extract text using pdf-parse
3. Chunk text into overlapping segments
4. Generate embeddings for each chunk
5. Store in MongoDB

---

### 3. Ask Question (Chat)

```http
POST /api/chat
Content-Type: application/json
```

**Request**:

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is this document about?"
  }'
```

**Parameters**:

- `query` (required): The question to ask about uploaded documents

**Response** (Success):

```json
{
  "answer": "Based on the documents, this is about [generated answer]..."
}
```

**Response** (No Context):

```json
{
  "answer": "I don't know"
}
```

**Process Flow**:

1. Generate embedding for the query
2. Search for top-5 most similar chunks using vector search
3. Build prompt with context chunks and query
4. Call Gemini 2.5 Flash LLM
5. Return generated answer

---

## 🏗️ Architecture & Workflow

### RAG (Retrieval-Augmented Generation) Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DOCUMENT UPLOAD FLOW                      │
├─────────────────────────────────────────────────────────────┤
│  1. User uploads PDF file                                    │
│  2. pdf-parse extracts raw text                              │
│  3. chunkText() splits into 700-char chunks with overlap     │
│  4. Each chunk is converted to embedding (768 dimensions)    │
│  5. Chunks stored in MongoDB with embeddings                 │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│                    QUESTION ANSWERING FLOW                   │
├─────────────────────────────────────────────────────────────┤
│  1. User asks a question                                     │
│  2. Query is converted to embedding (same model)             │
│  3. MongoDB Vector Search finds 5 most similar chunks        │
│  4. Prompt built: System instruction + Context + Query       │
│  5. Gemini 2.5 Flash generates answer from context only      │
│  6. Response sent to user                                    │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Diagram

```
Request
   ⬇️
Middleware (logging, parsing)
   ⬇️
Routes (uploadRoutes / chatRoutes)
   ⬇️
Controllers (uploadController / chatController)
   ⬇️
Services (aiServices - embeddings)
   ⬇️
Utils (chunkText)
   ⬇️
Database (MongoDB via Mongoose)
```

---

## 🗄️ Database Schema

### Chunk Collection

```javascript
{
  _id: ObjectId,
  text: String,           // Original text chunk
  embedding: [Number],    // Vector embedding (768 dimensions)
  createdAt: Date,        // Auto-added by Mongoose
  updatedAt: Date         // Auto-added by Mongoose
}
```

### MongoDB Atlas Vector Search Index

Required index configuration:

```json
{
  "name": "vector_index",
  "type": "vectorSearch",
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "similarity": "cosine",
      "dimensions": 768
    }
  ]
}
```

**Setup Steps**:

1. Go to MongoDB Atlas Dashboard
2. Select your cluster
3. Atlas Search → Create Search Index
4. Set index name: `vector_index`
5. Add vector field configuration above

---

## 🛡️ Error Handling

### Common Errors & Solutions

| Error                          | Cause                                | Solution                                   |
| ------------------------------ | ------------------------------------ | ------------------------------------------ |
| "No file uploaded"             | Missing file in multipart request    | Include file in form-data with key `file`  |
| "Error processing file"        | Invalid PDF format or corrupted file | Verify PDF integrity, try another file     |
| "MONGO_URI not found"          | Missing environment variable         | Add `MONGO_URI` to `.env`                  |
| "GEMINI_API_KEY not found"     | Missing API key in `.env`            | Add valid `GEMINI_API_KEY` to `.env`       |
| "Connection to MongoDB failed" | MongoDB server down or wrong URI     | Check connection string and MongoDB status |
| "Error generating embeddings"  | API quota exceeded or network issue  | Check Google API quotas and rate limits    |

### Error Response Format

All errors return JSON with appropriate HTTP status:

```json
{
  "message": "Error description"
}
```

**HTTP Status Codes**:

- `200` - Success
- `400` - Bad Request (validation error)
- `500` - Server Error (internal issue)

---

## 🧪 Development

### Scripts

```bash
# Start server with auto-reload
npm run dev

# Start server (production)
npm start

# Run tests (currently not configured)
npm test
```

### Debugging

Enable verbose logging by adding to `.env`:

```env
NODE_DEBUG=*
```

Or use Chrome DevTools:

```bash
node --inspect server.js
# Then open chrome://inspect in Chrome
```

### Making Changes

1. **Add new endpoint**:
   - Create route file in `routes/`
   - Create controller in `controllers/`
   - Mount route in `server.js`

2. **Add new model**:
   - Create schema file in `models/`
   - Import and use in controllers

3. **Modify chunk size**:
   - Edit `CHUNK_SIZE` in `utils/chunkText.js`
   - Re-upload documents for new chunks

---

## 🔍 Troubleshooting

### Server won't start

```bash
# Check if port is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Use different port
PORT=3000 npm start
```

### MongoDB connection fails

```bash
# Verify connection string format
mongodb+srv://username:password@cluster.mongodb.net/database

# Check IP whitelist in MongoDB Atlas
# Go to Database Access → Network Access
```

### Embeddings not being generated

```bash
# Verify API key
echo $GEMINI_API_KEY

# Check rate limits in Google Cloud Console
# Increase quota or wait for reset
```

### Vector search returns no results

```bash
# Ensure vector_index exists in MongoDB
# Verify chunk collection has embeddings
# Check query embedding generation success
```

### PDF parsing fails

```bash
# Ensure file is valid PDF
# Check file size (max 10MB)
# Try uploading with different PDF tool
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Mongoose Guide](https://mongoosejs.com/)
- [Google Generative AI Docs](https://ai.google.dev/docs)
- [Multer File Upload](https://github.com/expressjs/multer)
- [MongoDB Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/)

---

## 📝 License

ISC

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch: `git checkout -b feature/YourFeature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/YourFeature`
4. Submit a pull request

---

## 📞 Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages in console logs
3. Verify all environment variables are set correctly
4. Check MongoDB Atlas and Google Cloud dashboards for quota/status issues

---

**Last Updated**: 2026-05-20  
**Version**: 1.0.0
