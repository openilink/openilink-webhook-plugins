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
- If the service returns JSON with `content`, the plugin replies that content back to the sender
- Falls back to `message` or raw response body when needed

## Target Endpoint

- `https://bhwa233-api.vercel.app/api/command`
