#!/usr/bin/env bash
# Daily dead-URL probe for Relay markdown catalogs (files + timeline).
# crontab: 0 6 * * * /home/ari/dev/pt/paradigm-threat-files/scripts/check-dead-urls.daily.sh
set -euo pipefail

FILES_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TIMELINE_ROOT="$(cd "$FILES_ROOT/../paradigm-threat-timeline" && pwd)"

exec node "$FILES_ROOT/scripts/check-dead-urls.mjs" --write \
  --root "$FILES_ROOT" \
  --root "$TIMELINE_ROOT"
