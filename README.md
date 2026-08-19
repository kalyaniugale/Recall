# Recall

> A personal memory system that helps you save digital information now and find it later using the way you naturally remember it.

We save screenshots, posts, videos, notes and useful information every day. The problem is that when we actually need something again, we often don't remember its filename, exact wording, source, or where we saved it.

Recall is built around a simpler idea:

**You shouldn't have to remember where something is stored. You should only have to remember something about it.**

---

## The Problem

Our devices are very good at **storing information**, but not always good at helping us **recall information**.

Imagine these situations:

- "What was that Reel explaining rate limiting?"
- "I saved some React interview questions somewhere."
- "There was a screenshot with places to visit in Manali."
- "What was that DSA roadmap I saved?"
- "Where did I keep my charger?"

Traditional search usually expects us to know something exact:

- filename
- folder
- application
- keyword
- URL
- date

But human memory does not work like that.

We often remember only fragments:

> "It was something about rate limiting."

> "There was a screenshot with books."

> "I saw a diagram explaining DSA topics."

The information exists — but finding it again becomes the problem.

---

## The Idea

Recall acts as a **personal searchable memory layer**.

Instead of only storing files, Recall tries to understand what a saved item contains.

When something is added, Recall extracts useful information such as:

- visible text
- visual meaning
- spoken content
- important concepts
- topics
- summary
- searchable recall phrases

It then converts this understanding into a semantic embedding and stores it in a vector database.

Later, the user can search naturally.

```text
Saved:
Instagram Reel about Fixed Window,
Sliding Window, Token Bucket and
Leaky Bucket rate limiting

Later:

User:
"that reel about controlling too many API requests"

                    ↓

              Semantic Search

                    ↓

Recall finds the Rate Limiting Reel
```

The user does not need to remember the exact title.

---

# What Recall Currently Supports

Recall currently supports two major memory sources.

### Screenshot Memories

Users can upload screenshots containing:

- notes
- diagrams
- interview questions
- travel information
- study material
- social media content
- recommendations
- infographics

Recall analyzes the screenshot and generates searchable information from it.

### Instagram Reel Memories

Users can paste an Instagram Reel URL.

Recall processes the Reel and attempts to understand:

- Reel metadata
- caption
- creator
- thumbnail
- spoken content
- visual content
- important concepts
- semantic meaning

The Reel becomes searchable like any other memory.

The original Instagram URL is preserved so the user can return to the original Reel.

---

# Core Features

### Natural-Language Memory Search

Instead of searching exact keywords:

```text
"rate limiter"
```

users can search naturally:

```text
"that reel explaining how servers stop too many requests"
```

Semantic similarity is used to retrieve related memories.

---

### Screenshot Understanding

Uploaded screenshots are processed to identify:

```text
Screenshot
    │
    ├── Visible text
    ├── Visual description
    ├── Important terms
    ├── Topics
    ├── Summary
    └── Recall intents
```

This allows screenshots to be searched based on their **meaning**, not just their filename.

---

### Reel Understanding

Instagram Reels go through a multimodal processing pipeline.

```text
Instagram Reel URL
        │
        ▼
Resolve Reel metadata
        │
        ├── Creator
        ├── Caption
        ├── Thumbnail
        └── Original URL
        │
        ▼
      yt-dlp
        │
        ▼
 Download Reel
        │
        ▼
      FFmpeg
      /    \
     /      \
  Audio    Frames
    │         │
    ▼         ▼
Transcript  Visual Analysis
     \        /
      \      /
       ▼    ▼
   Combined Understanding
            │
            ▼
     Semantic Memory
```

---

### Personal Accounts

Recall supports user authentication using JWT.

Each memory belongs to a specific user.

```text
User A
 ├── Screenshot
 ├── Screenshot
 └── Reel

User B
 ├── Reel
 └── Screenshot
```

A user can only access and search their own memories.

Authentication currently includes:

- Register
- Login
- JWT-based protected routes
- Logout
- User-specific memory ownership

---

### Reel Preview and Source Recovery

Saved Reels retain their:

- thumbnail
- creator information
- generated understanding
- original URL

When a remembered Reel is found, the user can open its original Instagram source.

---

### Memory Management

Users can:

- save memories
- browse recent memories
- search memories
- inspect memory details
- delete memories
- revisit original Reel sources

---

# System Architecture

```text
                         RECALL
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
       React Frontend                  Express API
       Vite Client                         │
                                           ▼
                                   JWT Authentication
                                           │
                           ┌───────────────┴──────────────┐
                           │                              │
                           ▼                              ▼
                    Screenshot Flow                  Reel Flow
                           │                              │
                           ▼                              ▼
                    Image Analysis                 Reel Resolver
                           │                              │
                           │                          yt-dlp
                           │                              │
                           │                           FFmpeg
                           │                           /    \
                           │                          /      \
                           │                       Audio    Frames
                           │                         │        │
                           │                         ▼        ▼
                           │                    Transcript  Vision
                           │                         \        /
                           │                          \      /
                           └──────────────┬────────────▼────▼
                                          │
                                          ▼
                                Memory Understanding
                                          │
                             ┌────────────┴────────────┐
                             │                         │
                             ▼                         ▼
                          MongoDB                 Embedding
                             │                         │
                       Memory Record                   ▼
                                                   ChromaDB
                                                   (Docker)
```

---

# Why Two Databases?

Recall intentionally uses both **MongoDB** and **ChromaDB** because they solve different problems.

## MongoDB — Source of Truth

MongoDB stores the complete memory.

Example:

```json
{
  "userId": "...",
  "type": "reel",
  "originalUrl": "...",
  "content": {
    "title": "Rate Limiting Algorithms in System Design",
    "summary": "...",
    "topics": [
      "Rate Limiting",
      "System Design"
    ],
    "transcript": "..."
  },
  "reel": {
    "platform": "instagram",
    "username": "...",
    "thumbnailUrl": "..."
  }
}
```

MongoDB is responsible for structured application data.

---

## ChromaDB — Semantic Retrieval

ChromaDB stores the vector representation of a memory.

Conceptually:

```text
Memory

"Reel explaining Fixed Window,
Sliding Window and Token Bucket"

              ↓

        Embedding Model

              ↓

[0.013, -0.082, 0.271, ... ]

              ↓

           ChromaDB
```

This allows Recall to search by semantic similarity.

MongoDB answers:

> "What data belongs to this memory?"

ChromaDB answers:

> "Which memories are conceptually closest to what the user remembers?"

---

# Semantic Search Flow

Suppose a user searches:

```text
"that video about preventing too many API requests"
```

Recall performs the following process:

```text
User Query
    │
    ▼
Generate Query Embedding
    │
    ▼
ChromaDB Similarity Search
    │
    ▼
Closest Memory IDs
    │
    ▼
Filter by relevance
    │
    ▼
Fetch complete memories
from MongoDB
    │
    ▼
Preserve similarity ranking
    │
    ▼
Return results to React
```

This separates **semantic retrieval** from **application storage**.

---

# User Isolation in Semantic Search

Because Recall is a personal memory application, semantic search must never expose another user's memories.

Every memory is associated with:

```text
userId
```

The authenticated user's identity is extracted from the JWT.

Search results are then restricted to memories belonging to that user.

Conceptually:

```text
JWT
 │
 ▼
Authenticated User
 │
 ▼
Semantic Search
 │
 ▼
Candidate Memory IDs
 │
 ▼
MongoDB
 │
 └── userId MUST equal authenticated user
 │
 ▼
User's Memories Only
```

This prevents one account from retrieving another account's saved memories.

---

# Screenshot Processing Pipeline

When a screenshot is uploaded:

```text
React
  │
  ▼
multipart/form-data
  │
  ▼
Express
  │
  ▼
Multer
  │
  ▼
Image Processing
  │
  ├── OCR / visible text
  └── Visual understanding
          │
          ▼
   Structured Memory
          │
          ├── title
          ├── summary
          ├── topics
          ├── importantText
          ├── recallIntents
          └── visualDescription
          │
          ▼
       Embedding
          │
          ▼
       ChromaDB
```

The original image is stored separately while MongoDB stores its asset information.

---

# Instagram Reel Processing Pipeline

Reels require a more complex pipeline because useful information may exist in:

1. metadata
2. audio
3. video frames
4. caption

The Reel processing pipeline therefore combines multiple sources.

```text
Reel URL
   │
   ▼
URL Normalization
   │
   ▼
Instagram Metadata
   │
   ├── shortcode
   ├── username
   ├── caption
   └── thumbnail
   │
   ▼
yt-dlp
   │
   ▼
Temporary Reel Download
   │
   ▼
FFmpeg
   │
   ├─────────────┐
   ▼             ▼
Audio           Frames
   │             │
   ▼             ▼
Speech          Visual
Recognition     Understanding
   │             │
   └──────┬──────┘
          ▼
Combined Reel Context
          │
          ▼
Structured Memory
          │
          ▼
Embedding
          │
          ▼
ChromaDB
```

Temporary processing files are not intended to become permanent application storage.

---

# Authentication Flow

Recall uses token-based authentication.

```text
Register / Login
       │
       ▼
Express Auth API
       │
       ▼
Validate Credentials
       │
       ▼
Generate JWT
       │
       ▼
React Client
       │
       ▼
Authorization Header

Bearer <token>
       │
       ▼
requireAuth Middleware
       │
       ▼
req.user
       │
       ▼
Protected Memory APIs
```

Memory operations therefore execute in the context of the authenticated user.

---

# Technology Stack

## Frontend

**React**

Used to build the interactive client application.

**Vite**

Development server and frontend build tooling.

**CSS**

Custom styling is used instead of relying on a large component library.

The interface is intentionally designed around the idea of a calm **personal memory shelf** rather than a traditional administrative dashboard.

---

## Backend

**Node.js**

Runtime for the server application.

**Express.js**

Provides REST API routes, middleware and request handling.

**Multer**

Handles screenshot uploads using multipart form data.

**JWT**

Provides token-based authentication.

---

## Data

**MongoDB**

Primary application database.

Stores:

- users
- memory ownership
- generated content
- Reel information
- asset information
- processing status

**Mongoose**

Provides schemas and MongoDB data access.

---

## Semantic Search

**Embeddings**

Memory content and search queries are converted into numerical vector representations.

**ChromaDB**

Vector database used for semantic similarity search.

ChromaDB runs locally using Docker.

---

## Media Processing

**yt-dlp**

Used by the Reel pipeline to retrieve media for temporary processing.

**FFmpeg**

Used for operations such as:

- audio extraction
- media conversion
- frame extraction
- audio/video processing

**Python**

Provides the runtime required by the current yt-dlp development workflow.

---

## Media Storage

**Cloudinary**

Used to store uploaded screenshot assets.

MongoDB stores references to those assets rather than the image binary itself.

---

# Local Development Setup

## Prerequisites

Install:

- Node.js
- npm
- MongoDB
- Docker Desktop
- Python
- yt-dlp
- FFmpeg

---

# 1. Clone Repository

```bash
git clone <your-repository-url>
cd Recall
```

---

# 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

# 3. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

---

# 4. Install yt-dlp

Check Python:

```bash
py --version
```

Install/update yt-dlp:

```bash
py -m pip install -U yt-dlp
```

Verify:

```bash
py -m yt_dlp --version
```

---

# 5. Install FFmpeg

Install FFmpeg and make sure it is available from the command line.

Verify:

```bash
ffmpeg -version
```

If this command is not recognized, add FFmpeg's `bin` directory to your system PATH.

---

# 6. Start MongoDB

Make sure your MongoDB instance is running.

The backend should be able to connect using the MongoDB URI configured in `.env`.

---

# 7. Start ChromaDB with Docker

ChromaDB is used for semantic vector search.

Create the container:

```bash
docker run -d \
  --name recall-chroma \
  -p 8000:8000 \
  -v recall_chroma_data:/data \
  chromadb/chroma
```

On Windows PowerShell, the command can also be written on one line:

```bash
docker run -d --name recall-chroma -p 8000:8000 -v recall_chroma_data:/data chromadb/chroma
```

After the container has been created once, future sessions only require:

```bash
docker start recall-chroma
```

Check running containers:

```bash
docker ps
```

Stop Chroma:

```bash
docker stop recall-chroma
```

Restart it:

```bash
docker restart recall-chroma
```

View logs:

```bash
docker logs recall-chroma
```

The backend connects to ChromaDB at:

```text
localhost:8000
```

---

# 8. Configure Environment Variables

Create:

```text
server/.env
```

Use `.env.example` as the reference.

Example structure:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret

CHROMA_HOST=localhost
CHROMA_PORT=8000

SEARCH_MAX_DISTANCE=0.75

# Add the AI / embedding / Cloudinary
# credentials required by your local setup.
```

Do **not** commit `.env`.

---

# 9. Start Backend

```bash
cd server
npm run dev
```

or, depending on the configured scripts:

```bash
npm start
```

Expected server:

```text
http://localhost:5000
```

---

# 10. Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Expected frontend:

```text
http://localhost:5173
```

---

# Recommended Development Startup

After the project has been installed once, development normally requires three terminals.

### Terminal 1 — ChromaDB

```bash
docker start recall-chroma
```

### Terminal 2 — Backend

```bash
cd server
npm run dev
```

### Terminal 3 — Frontend

```bash
cd client
npm run dev
```

MongoDB must also be accessible.

---

# API Overview

Current API structure follows roughly:

```text
/api/v1

├── /auth
│
├── /memories
│   ├── GET    /
│   ├── POST   /screenshots
│   ├── POST   /reels
│   └── DELETE /:id
│
└── /search
    └── GET /
```

Protected memory endpoints require:

```http
Authorization: Bearer <JWT>
```

---

# Memory Model

A memory has a common structure regardless of where it came from.

```text
Memory
│
├── userId
├── type
│
├── asset
│   ├── url
│   ├── publicId
│   ├── mimeType
│   └── size
│
├── originalUrl
│
├── content
│   ├── extractedText
│   ├── visualDescription
│   ├── title
│   ├── summary
│   ├── topics[]
│   ├── recallIntents[]
│   ├── importantText[]
│   ├── transcript
│   └── tags[]
│
├── reel
│   ├── platform
│   ├── shortcode
│   ├── username
│   ├── caption
│   ├── thumbnailUrl
│   ├── duration
│   └── language
│
└── processing
    ├── status
    └── error
```

This shared representation allows completely different inputs to participate in the same semantic search system.

---

# Why Recall Is Different From Normal File Search

Consider a screenshot named:

```text
Screenshot_2026-08-19.png
```

The filename tells us almost nothing.

Recall may understand it as:

```text
Title:
React JS Interview Questions

Topics:
React
Redux
Hooks
Webpack

Important concepts:
Redux Saga
Redux Thunk
Component lifecycle

Recall intents:
"React questions I saved"
"that Redux interview screenshot"
"frontend interview preparation"
```

Now the memory can be retrieved through its **meaning**, even though none of those words exist in its filename.

---

# Design Philosophy

Recall is intentionally not designed like a file manager or enterprise dashboard.

The interface is meant to feel like a small personal place where information can be safely kept and rediscovered.

The design principles are:

- calm rather than crowded
- minimal rather than feature-heavy
- memory-oriented rather than file-oriented
- natural language over rigid filters
- visual browsing when the user does not know exactly what to search
- clear separation between screenshots and saved Reels

The product should feel less like:

> "Manage your database."

and more like:

> "I know I saved this somewhere."

---

# Privacy Model

Recall treats memories as private user-owned data.

Each memory stores the ID of its owner.

Protected operations use the authenticated user rather than accepting arbitrary ownership information from the client.

The fundamental rule is:

```text
Authenticated User
        │
        ▼
   Their Memories
        │
        X
Other Users' Memories
```

This principle must apply to normal database queries as well as semantic/vector search.

---

# Current Limitations

Recall is currently a development-stage project.

Some current limitations include:

- Instagram processing depends on externally accessible Reel data.
- Private or restricted Reels may not be processable.
- Instagram thumbnail URLs may be temporary.
- Reel processing can take significantly longer than screenshot processing.
- Media extraction depends on yt-dlp and FFmpeg.
- Semantic search quality depends on generated memory descriptions and embeddings.
- The current application is designed primarily for local development.
- Production deployment, background job processing and large-scale media processing are future improvements.

---

# Roadmap

## Physical Memory

One of the next major features is remembering **physical objects and places**.

Example:

The user takes a picture of a drawer containing a charger.

Recall understands:

```text
Objects:
- charger
- notebook
- cable

Location:
study table drawer
```

Later:

```text
User:
"Where did I keep my charger?"

        ↓

Recall:
"You saved it in your study table drawer."
```

This extends Recall beyond digital information into **real-world memory assistance**.

---

## Planned Improvements

Future work may include:

- physical object memories
- "Where did I keep this?" queries
- camera-based memory capture
- improved memory organization
- user-created tags
- favorites
- memory collections
- better multimodal retrieval
- duplicate-memory detection
- background Reel processing
- processing queues
- improved vector filtering
- persistent Reel thumbnail storage
- additional supported content sources
- production deployment
- Docker Compose development environment

---

# Engineering Concepts Demonstrated

Recall is designed not only as a CRUD application but as an exploration of several software engineering concepts:

```text
Full-stack development
        +
Authentication & authorization
        +
REST API design
        +
Multimodal AI processing
        +
OCR / vision understanding
        +
Audio/video processing
        +
Vector embeddings
        +
Semantic search
        +
Vector databases
        +
MongoDB
        +
Cloud media storage
        +
Docker
        +
External media processing
        +
User data isolation
```

---

# Project Goal

Recall started from a simple question:

> **What if search worked the way we remember?**

Instead of forcing users to organize everything perfectly when saving it, Recall attempts to understand the information at the moment it is stored.

The long-term goal is to create a personal memory layer capable of remembering both digital and physical information — and retrieving it from incomplete, natural human recollection.

---

## Status

🚧 **Under active development**

Currently implemented:

- Screenshot memories
- Screenshot understanding
- Instagram Reel memories
- Reel metadata extraction
- Reel audio/video processing
- Semantic embeddings
- ChromaDB vector search
- MongoDB persistence
- Cloudinary image storage
- JWT authentication
- User-specific memories
- Natural-language retrieval
- Reel source recovery

Next major feature:

**Physical memory — "Where did I keep that?"**