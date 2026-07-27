# PathPilot AI — AI Systems & Gemini Integration Architecture

**AI SDK:** `@google/genai` v0.1+  
**Primary Engine:** Google Gemini 2.5 Flash / Gemini 3.5 Flash  
**Architecture Pattern:** Server-Side Proxying & Strict Structured JSON Generation

---

## System Architecture

All AI reasoning in PathPilot AI operates strictly server-side inside `server.ts` or server API modules. The client single-page app (SPA) never imports Gemini keys or dispatches direct queries to external AI endpoints. This guarantees zero key leakage and permits prompt sanitization, rate limiting, and response validation.

```
[ Client Browser ]
       │
       │ HTTP POST /api/chat or /api/analyze-resume
       ▼
[ Express Server Proxy ]
       │ 1. Validate JWT session
       │ 2. Sanitize input & prevent prompt injection
       │ 3. Hydrate prompt with domain context & system rules
       ▼
[ @google/genai Client ]
       │ Dispatches request with GEMINI_API_KEY
       ▼
[ Google Gemini Flash ]
       │ Evaluates prompt & generates structured JSON
       ▼
[ Express Response Validator ]
       │ 1. Parse JSON output against TypeScript schema
       │ 2. Compute confidence metrics
       ▼
[ Client UI (Animated State Update) ]
```

---

## Models & Use Cases

| Capability | Gemini Model Variant | System Purpose |
| :--- | :--- | :--- |
| **AI Career Mentor Chat** | `gemini-2.5-flash` | Interactive real-time coaching, streaming answers, multi-turn conversation memory |
| **Resume Analyzer** | `gemini-2.5-flash` | Extracting raw skills, calculating ATS match score (0-100), detecting missing keywords |
| **Roadmap Generator** | `gemini-2.5-flash` | Constructing 3-phase transition milestones, estimated completion times, resource links |
| **Interview Evaluator** | `gemini-2.5-flash` | Evaluating STAR methodology compliance in user interview answers |
| **Autonomous Agents** | `gemini-2.5-flash` | Task decomposition, automated research, multi-step job application optimization |

---

## Prompt Engineering & Structured JSON Enforcement

### 1. Resume Analysis Prompt Pattern

```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeResume(resumeText: string, targetRole: string) {
  const prompt = `
You are an expert Silicon Valley Technical Recruiter & Resume Strategist.
Analyze the following resume against the target role: "${targetRole}".

RESUME TEXT:
"""
${resumeText}
"""

Return ONLY a valid, minified JSON object matching this exact schema:
{
  "matchScore": number (0-100),
  "foundSkills": string[],
  "missingSkills": string[],
  "formatRating": string ("A+", "A", "B", "C"),
  "quantifiableMetricsScore": number (0-100),
  "actionableFeedback": string[],
  "suggestedBulletPoints": string[]
}
Do not include markdown code block formatting (like \`\`\`json). Output pure raw JSON.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.2, // Low variance for consistent scoring
      topP: 0.8,
    },
  });

  const rawText = response.text?.trim() || '{}';
  // Clean markdown syntax if present
  const jsonString = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(jsonString);
}
```

---

## Safety Guardrails & Input Sanitization

PathPilot AI implements multi-tiered security checks before transmitting user content to the AI model:

### 1. Prompt Injection Filter
Before processing user input, input text is evaluated against injection signatures:
- Direct system override phrases (e.g., `"ignore all previous instructions"`, `"system override mode"`)
- Secret extraction attempts (e.g., `"print environment variables"`, `"expose GEMINI_API_KEY"`)

If a signature is matched, the request is immediately rejected with `HTTP 400 Bad Request` and logged.

### 2. PII Sanitization Stream
Sensitive contact data (Social Security numbers, driver's license numbers, private street address numbers) are stripped using regex pattern matching prior to sending payloads to external APIs.

### 3. Graceful Fallback Engine
If the Gemini API encounters rate limits (`HTTP 429`) or temporary service unavailability, PathPilot AI falls back gracefully to a high-fidelity local heuristic parser. The user experience remains unbroken, displaying an informative badge ("Analyzed via Local Benchmark Engine") without crashing.
