#!/usr/bin/env bash
# ieee-paper-writer — one-command hook installer for Claude Code
#
# Usage:
#   bash install.sh [--force]
#   or:  node bin/install.js --only claude   (preferred)

set -euo pipefail

CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
HOOKS_DIR="$CLAUDE_DIR/hooks"
SETTINGS="$CLAUDE_DIR/settings.json"

if ! command -v node &>/dev/null; then
  echo "ERROR: 'node' is required to install the ieee-paper-writer hooks." >&2
  exit 1
fi

FORCE=0
for arg in "$@"; do
  case "$arg" in --force|-f) FORCE=1 ;; esac
done

mkdir -p "$HOOKS_DIR"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$FORCE" -eq 1 ] && [ -f "$HOOKS_DIR/ieee-paper-activate.js" ]; then
  echo "Reinstalling ieee-paper-writer hooks (--force)..."
else
  echo "Installing ieee-paper-writer hooks..."
fi

cp "$SCRIPT_DIR/ieee-paper-activate.js" "$HOOKS_DIR/ieee-paper-activate.js"
cp "$SCRIPT_DIR/ieee-paper-tracker.js"  "$HOOKS_DIR/ieee-paper-tracker.js"
cp "$SCRIPT_DIR/package.json"           "$HOOKS_DIR/package.json"

node - "$HOOKS_DIR" "$SETTINGS" << 'JSEOF'
'use strict';
const fs = require('fs');
const hooksDir = process.argv[2];
const settingsPath = process.argv[3];
let settings = {};
try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch {}
if (!settings.hooks) settings.hooks = {};
const has = (ev) => ((settings.hooks[ev] || []).flatMap(e => e.hooks || [])).some(h => h.command && h.command.includes('ieee-paper'));
if (!has('SessionStart')) {
  settings.hooks.SessionStart = settings.hooks.SessionStart || [];
  settings.hooks.SessionStart.push({ matcher: '', hooks: [{ type: 'command', command: 'node "' + hooksDir + '/ieee-paper-activate.js"', timeout: 10, statusMessage: 'Loading ieee-paper-writer...' }] });
}
if (!has('UserPromptSubmit')) {
  settings.hooks.UserPromptSubmit = settings.hooks.UserPromptSubmit || [];
  settings.hooks.UserPromptSubmit.push({ matcher: '', hooks: [{ type: 'command', command: 'node "' + hooksDir + '/ieee-paper-tracker.js"', timeout: 10, statusMessage: 'Tracking ieee-paper-writer...' }] });
}
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
console.log('  settings.json updated.');
JSEOF

echo ""
echo "ieee-paper-writer hooks installed."
echo "  - SessionStart: injects pipeline rules every session"
echo "  - UserPromptSubmit: detects paper-writing triggers"
echo "Restart Claude Code to activate."
