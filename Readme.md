## Features

* **Gemini integration** using `@google/genai`
* **Streaming responses** using Server-Sent Events (SSE)
* **Input validation**

  * Message must be a non-empty string
  * Maximum 1000 characters
* **Rate limiting**

  * Maximum 10 requests per 60 seconds
  * Implemented with NestJS `ThrottlerGuard`
* **Client cancellation**

  * Gemini requests are cancelled if the client disconnects
* **First-response timeout**

  * Gemini has 8 seconds to start responding
* **Retry system**

  * Retries temporary `429` and `503` errors
* **Fallback models**

  * Can switch to another configured Gemini model after timeout or `404`
* **Partial-response protection**

  * If streaming has already started, the service does not switch models
* **Error handling**

  * Controlled errors are returned to the frontend

## Architecture

```text
Frontend
   │
   │ POST /bot/stream
   ▼
ThrottlerGuard
   │
   ▼
BotController
   │
   ▼
BotService
   │
   ▼
Gemini API
   │
   │ streamed chunks
   ▼
Frontend
```

## Main Endpoint

```text
POST /bot/stream
```

Example:

```bash
curl -N -X POST http://localhost:3000/bot/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"Suggest a chill activity for 3 friends"}'
```

The response is streamed using SSE:

```text
data: "Here is"

data: " a"

data: " chill activity..."

data: [DONE]
```

## Rate Limiting

Configured in `AppModule`:

```ts
ThrottlerModule.forRoot([
  {
    ttl: 60000,
    limit: 10,
  },
]);
```

Applied to the bot with:

```ts
@UseGuards(ThrottlerGuard)
```

## Gemini Configuration

Environment variables:

```env
GEMINI_API_KEY=...
GEMINI_MODEL=...
GEMINI_FALLBACK_MODELS=...
```

The API key must not be committed to the repository.

## Error Strategy

```text
Success
   → stream response → DONE

429 / 503
   → retry

Timeout / 404
   → try fallback model

Other error
   → throw error

Client disconnect
   → cancel request
```

The goal is to provide a **streaming AI assistant that is protected against abuse, slow responses, temporary Gemini failures, and disconnected clients**.
