# ieee-paper-writer — opencode plugin

Native opencode plugin. Mirrors the Claude Code hook architecture using
opencode's `session.created` + `tui.prompt.append` lifecycle hooks.

## What this ships

| File | Role |
|---|---|
| `plugin.js` | ESM Bun module. Default-exports an opencode `Plugin` factory. |
| `package.json` | Marks the directory as ESM so Bun loads `plugin.js` correctly. |
| `commands/ieee-paper-writer.md` | Slash-command prompt template (`/ieee-paper-writer`). |

The installer (`bin/install.js --only opencode`) copies these into
`~/.config/opencode/plugins/ieee-paper-writer/` and patches `opencode.json` with a
`"plugin"` array entry.

## What it does

- `session.created` → emits the ieee-paper-writer pipeline rules as hidden session context.
- `tui.prompt.append` → detects paper-writing triggers (`/ieee-paper-writer`, "write the introduction",
  "peer review this", etc.) and appends a pipeline stage reminder to keep the four-agent flow
  in the model's attention each turn.

## What it does NOT do

- **No statusline badge.** opencode's TUI does not expose a plugin-writable statusline.
- The always-on pipeline ruleset comes from `~/.config/opencode/AGENTS.md` (also written
  by the installer) so the rules load even when the plugin runtime is broken.
