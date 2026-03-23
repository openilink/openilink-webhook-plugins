# Command Service Bridge

Forward text messages to a command service endpoint and reply with the returned content. Supports text, JSON image payloads, and direct binary HTTP responses.

## Behavior

- Accepts text messages only
- Skips empty text
- Sends JSON payload in the form:

```json
{"command":"hp"}
```

- Parses the HTTP response body
- If the service returns JSON with `type: text`, the plugin replies `content`
- If the service returns JSON with `type: image`:
  - sends `data:image/...` content directly via `reply(content)`
  - sends raw base64 via `reply({ base64: ..., filename: ... })`
  - forwards binary HTTP responses via `reply({ forward: true })` when applicable
  - falls back to replying the URL when the API returns an `http/https` image URL

## Target Endpoint

- `https://bhwa233-api.vercel.app/api/command`



## Runtime Notes

- Declares `@timeout 30` to tolerate slower command API responses.
