#!/usr/bin/env bash
set -euo pipefail
find plugins -name plugin.js | while read -r f; do
  grep -q '^// ==WebhookPlugin==$' "$f"
  grep -q '^// @name' "$f"
  grep -q '^// @connect' "$f"
  grep -q '^// ==/WebhookPlugin==$' "$f"
  echo "ok: $f"
done
