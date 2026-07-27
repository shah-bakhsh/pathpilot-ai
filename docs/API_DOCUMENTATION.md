# PathPilot AI — REST API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:3000/api` (Development) | `https://<domain>/api` (Production)  
**Authentication:** Bearer JWT Token (`Authorization: Bearer <supabase_jwt>`)  
**Content-Type:** `application/json`

---

## Overview

The PathPilot AI backend is served via a unified Express server (`server.ts`) running on Node.js. All API endpoints enforce strict input validation, rate limiting, and authorization checks. AI capabilities leverage the official `@google/genai` SDK targeting Gemini Flash models server-side.

---

## Global Headers & Rate Limits

### Request Headers
| Header | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Content-Type` | `string` | Yes | Must be `application/json` |
| `Authorization` | `string` | Optional* | `Bearer <jwt_token>` for protected user endpoints |
| `x-client-version` | `string` | No | Client application release identifier |

### Rate Limiting Policy
- **Global Public Endpoints:** 100 requests per 15-minute window per IP.
- **AI Generation Endpoints:** 20 requests per 1-minute window per authenticated user.
- **Exceeding Limits Response:** `HTTP 429 Too Many Requests` with header `Retry-After: <seconds>`.

---

## System Endpoints

### 1. Health Check
Returns system operational status, environment state, and current database connectivity.

- **Method:** `GET`
- **Endpoint:** `/api/health`
- **Auth Required:** No

#### Response (`200 OK`)
```json
{
  "status": "healthy",
  "timestamp": "2026-07-24T11:00:00.000Z",
  "environment": "production",
  "services": {
    "database": "connected",
    "gemini_api": "configured"
  }
}
```

---

## AI Career Mentorship & Coaching

### 2. Mentor Chat Completion
Dispatches a conversation query to the Gemini AI Career Mentor with contextual awareness of user goals and resume.

- **Method:** `POST`
- **Endpoint:** `/api/chat`
- **Auth Required:** Yes

#### Request Body
```json
{
  "messages": [
    {
      "role": "user",
      "content": "How should I transition from Junior Full Stack Dev to Senior Cloud Architect?"
    }
  ],
  "context": {
    "currentRole": "Junior Full Stack Developer",
    "targetRole": "Senior Cloud Architect",
    "topSkills": ["React", "Node.js", "TypeScript"]
  }
}
```

#### Response (`200 OK`)
```json
{
  "message": {
    "role": "assistant",
    "content": "Transitioning to Senior Cloud Architect requires mastering distributed systems, cloud security, and Infrastructure as Code (IaC)...",
    "confidenceRating": 0.98,
    "suggestedActions": [
      "Review AWS Solutions Architect certification roadmap",
      "Practice Terraform IaC modules"
    ]
  }
}
```

---

## Resume Analysis & Optimization

### 3. Analyze Resume
Performs deep structural, keyword, and skills gap analysis against a target job description or industry benchmark.

- **Method:** `POST`
- **Endpoint:** `/api/analyze-resume`
- **Auth Required:** Yes

#### Request Body
```json
{
  "resumeText": "Experienced developer skilled in JavaScript, React, HTML...",
  "targetRole": "Senior AI Systems Engineer",
  "jobDescription": "Seeking Senior AI Engineer with Python, Gemini API, PyTorch..."
}
```

#### Response (`200 OK`)
```json
{
  "matchScore": 78,
  "foundSkills": ["JavaScript", "React", "Node.js"],
  "missingSkills": ["Python", "PyTorch", "Gemini API", "Vector Databases"],
  "formatRating": "A-",
  "quantifiableMetricsScore": 65,
  "actionableFeedback": [
    "Include explicit impact numbers for past web applications",
    "Highlight exposure to AI API integration and vector indexes"
  ],
  "suggestedBulletPoints": [
    "Integrated Google Gemini LLM API reducing user response latency by 35%"
  ]
}
```

---

## Career Roadmap & Execution

### 4. Generate Career Roadmap
Generates a 3-phase progressive transition milestone plan with estimated completion timelines and official resource URLs.

- **Method:** `POST`
- **Endpoint:** `/api/generate-roadmap`
- **Auth Required:** Yes

#### Request Body
```json
{
  "currentRole": "Frontend Engineer",
  "targetRole": "Principal Architect",
  "timeframeMonths": 12
}
```

#### Response (`200 OK`)
```json
{
  "phases": [
    {
      "phase": 1,
      "title": "Core Cloud & Systems Mastery",
      "duration": "3 Months",
      "milestones": [
        "Master Docker container orchestration and Kubernetes basics",
        "Implement distributed caching with Redis and CDN edge networks"
      ],
      "recommendedResources": [
        {
          "name": "Google Cloud Architecture Framework",
          "url": "https://cloud.google.com/architecture/framework"
        }
      ]
    }
  ]
}
```

---

## Interview Simulator & Feedback

### 5. Evaluate Interview Response
Evaluates a candidate's response to a behavioral or technical interview prompt, providing STAR method feedback.

- **Method:** `POST`
- **Endpoint:** `/api/interview-feedback`
- **Auth Required:** Yes

#### Request Body
```json
{
  "question": "Tell me about a time you resolved a major production outrage.",
  "response": "When our server went down, I looked at logs and restarted Node...",
  "targetRole": "Senior DevOps Engineer"
}
```

#### Response (`200 OK`)
```json
{
  "score": 82,
  "clarity": "Good",
  "starStructureScore": 75,
  "strengths": ["Direct problem identification", "Quick resolution focus"],
  "improvements": [
    "Elaborate on root cause analysis and preventative automation implemented afterwards"
  ],
  "recommendedAnswer": "In my previous role, when an API gateway latency spiked, I immediately isolated..."
}
```

---

## Agent Ecosystem Execution

### 6. Execute Autonomous Agent Workflow
Triggers an autonomous multi-step career agent to perform research, resume drafting, or task scheduling.

- **Method:** `POST`
- **Endpoint:** `/api/agent-execute`
- **Auth Required:** Yes

#### Request Body
```json
{
  "agentId": "resume-optimizer-agent",
  "payload": {
    "targetCompany": "Google",
    "targetRole": "Staff Software Engineer"
  }
}
```

#### Response (`200 OK`)
```json
{
  "executionId": "exec-99201a",
  "status": "completed",
  "output": {
    "optimizedSections": ["Summary", "Experience", "Skills"],
    "keyKeywordsAdded": ["Distributed Systems", "gRPC", "Cloud Spanner"]
  },
  "executionTimeMs": 1420
}
```

---

## Error Response Format

All API errors return standard HTTP error status codes with uniform JSON payloads:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "The resumeText parameter must be a non-empty string.",
    "status": 400,
    "timestamp": "2026-07-24T11:05:00.000Z"
  }
}
```

### Common Error Codes
| Status | Code | Description |
| :--- | :--- | :--- |
| `400` | `INVALID_INPUT` | Malformed JSON or missing required fields |
| `401` | `UNAUTHORIZED` | Missing or invalid Bearer authentication token |
| `403` | `FORBIDDEN` | User does not have authorization for this resource |
| `429` | `RATE_LIMIT_EXCEEDED` | Request threshold reached; slow down requests |
| `500` | `INTERNAL_SERVER_ERROR` | Server-side execution or third-party service exception |
