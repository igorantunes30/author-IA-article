#!/usr/bin/env bash
# ieee-paper-writer — uninstaller for Claude Code hooks

set -euo pipefail
CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
HOOKS_DIR="$CLAUDE_DIR/hooks"
SETTINGS="$CLAUDE_DIR/settings.json"
HOOK_FILES=("ieee-paper-activate.js" "ieee-paper-tracker.js" "package.json")

echo "Uninstalling ieee-paper-writer hooks..."
for f in "${HOOK_FILES[@]}"; do
  target="$HOOKS_DIR/$f"
  [ -f "$target" ] && rm "$target" && echo "  removed $f"
done

node - "$HOOKS_DIR" "$SETTINGS" << 'JSEOF'
'use strict';
const fs = require('fs');
const hooksDir = process.argv[2];
const settingsPath = process.argv[3];
let settings = {};
try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch { process.exit(0); }
let removed = 0;
for (const event of ['SessionStart', 'UserPromptSubmit']) {
  if (!settings.hooks || !settings.hooks[event]) continue;
  settings.hooks[event] = settings.hooks[event].map(e => {
    if (!e.hooks) return e;
    const before = e.hooks.length;
    e.hooks = e.hooks.filter(h => !(h.command && h.command.includes('ieee-paper')));
    removed += before - e.hooks.length;
    return e;
  }).filter(e => e.hooks && e.hooks.length > 0);
}
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
console.log('  Removed ' + removed + ' ieee-paper-writer hook entries from settings.json');
JSEOF

echo ""
echo "ieee-paper-writer hooks removed. Restart Claude Code."
echo "To remove the plugin:  claude plugin disable ieee-paper-writer"
