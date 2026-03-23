# OpenILink Webhook Plugins

Official-style repository for OpenILink webhook plugins.

## Structure

- `plugins/` — one directory per plugin
- `docs/` — repository-wide docs and conventions
- `scripts/` — helper scripts for validation and maintenance

## Plugins

- `plugins/command-service-bridge` — forwards text messages to an HTTP command service

## Plugin Development Rules

- Use ES5 syntax
- Include a valid `// ==WebhookPlugin==` metadata block
- Set `ctx.req.body` with `JSON.stringify(...)`
- Declare `@connect` and `@grant` explicitly
