# ieee-paper-writer Hooks

These hooks are **bundled with the ieee-paper-writer plugin** and activate automatically when the plugin is installed. No manual setup required.

If you installed ieee-paper-writer standalone (without the plugin), the unified Node installer at `bin/install.js` wires them into your `settings.json` for you — run `node bin/install.js --only claude` from a clone.

## What's Included

### `ieee-paper-activate.js` — SessionStart hook

- Runs once when Claude Code starts
- Reads `skills/ieee-paper-writer/SKILL.md` and emits the body (without frontmatter) as hidden SessionStart context
- Claude Code injects SessionStart hook stdout as system context — the pipeline is always visible to the model
- Falls back to a minimal description if SKILL.md is not found

### `ieee-paper-tracker.js` — UserPromptSubmit hook

- Fires on every user prompt
- Matches paper-writing triggers: `/ieee-paper-writer`, `/ieee-paper`, "write the introduction", "draft the methodology", "peer review this", "rewrite in IEEE style", "make this more scientific"
- When matched, emits `hookSpecificOutput` JSON with a pipeline stage summary, keeping the pipeline visible in model attention per turn

Both hooks silent-fail on all filesystem errors. Neither blocks session start.

## How It Works

```
SessionStart hook ──reads SKILL.md──▶ hidden system context (Claude sees, user doesn't)
                                              │
                                         pipeline active
                                              │
UserPromptSubmit hook ──detects trigger──▶ emits stage reminder per turn
```

## Uninstall

If installed via plugin: disable the plugin — hooks deactivate automatically.

If installed via the standalone Node installer:

```bash
node bin/install.js --uninstall
```

Or manually:
1. Remove `ieee-paper-activate.js` and `ieee-paper-tracker.js` from `$CLAUDE_CONFIG_DIR/hooks/` (default `~/.claude/hooks/`).
2. Remove the SessionStart and UserPromptSubmit entries from `$CLAUDE_CONFIG_DIR/settings.json`.
