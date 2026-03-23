# Development

OpenILink webhook plugins run in a sandboxed JavaScript runtime.

Key requirements:

- ES5 syntax only
- No `require`, `process`, `fs`, or custom network calls
- Modify `ctx.req`; Hub sends the actual HTTP request
- Use `JSON.stringify()` for request bodies
