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
  - normalizes `data:image/...` payloads by stripping the data URL prefix, matching the awsl-wechat-bot command service behavior
  - falls back to a text notice because current OpenILink `reply()` only supports text

## Target Endpoint

- `https://bhwa233-api.vercel.app/api/command`

## Limitation

Current OpenILink Webhook sandbox `reply()` supports text only. It cannot directly send binary image replies.
