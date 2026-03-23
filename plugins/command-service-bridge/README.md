# Command Service Bridge

Forward text messages to a command service endpoint and reply with the returned content.

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
  - replies with the image URL when `content` is an `http/https` URL
  - falls back to a text notice when `content` is a base64 `data:image/...` payload

## Target Endpoint

- `https://bhwa233-api.vercel.app/api/command`

## Limitation

Current OpenILink Webhook sandbox `reply()` supports text only. It cannot directly send binary image replies.
