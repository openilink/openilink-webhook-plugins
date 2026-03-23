# Command Service Bridge

Forward text messages to a command service endpoint.

## Behavior

- Accepts text messages only
- Skips empty text
- Sends JSON payload in the form:

```json
{"command":"hp"}
```

## Target Endpoint

- `https://bhwa233-api.vercel.app/api/command`

## Notes

Current version forwards requests only. It does not call `reply()` yet.
