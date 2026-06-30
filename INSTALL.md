# Install ieee-paper-writer

One install. Works for every AI coding agent on your machine.

If just want it to work, run the one-liner. If want to know what gets touched, scroll down.

## One-liner

**macOS / Linux / WSL / Git Bash**

```bash
curl -fsSL https://raw.githubusercontent.com/ivan-neves/ieee-paper-writer/main/install.sh | bash
```

**Windows (PowerShell 5.1+)**

```powershell
irm https://raw.githubusercontent.com/ivan-neves/ieee-paper-writer/main/install.ps1 | iex
```

> Piping a script straight into a shell runs it sight-unseen. If you'd rather read it first, download then run: `curl -fsSL https://raw.githubusercontent.com/ivan-neves/ieee-paper-writer/main/install.sh -o install.sh` (review it) `&& bash install.sh`. The installer downloads hook files from a pinned release tag and verifies them against a committed SHA-256 manifest before writing.

What it does:

- Auto-detects every supported agent installed on your machine (Claude Code, Cursor, Codex, etc.).
- For each one, runs that agent's native install path (plugin / extension / rule file / `npx skills add`).
- Wires Claude Code hooks on top (session activation + paper-writing trigger detection).
- Skips anything you don't have. Safe to re-run. ~30 seconds end-to-end.

Want to preview before installing? Use `--dry-run`:

```bash
curl -fsSL https://raw.githubusercontent.com/ivan-neves/ieee-paper-writer/main/install.sh | bash -s -- --dry-run
```

## Per-agent install

If you want to install for one agent (or want to know exactly what command runs under the hood), use the table below. Every row also works as `--only <id>` to the unified installer.

| Agent | Install command | Auto-activates? |
|---|---|:-:|
| **Claude Code** | `claude plugin marketplace add ivan-neves/ieee-paper-writer && claude plugin install ieee-paper-writer@ieee-paper-writer` | Yes |
| **Gemini CLI** | `gemini extensions install https://github.com/ivan-neves/ieee-paper-writer` | Yes |
| **opencode** | `node bin/install.js --only opencode` *(or `npx -y github:ivan-neves/ieee-paper-writer -- --only opencode`)* | Yes (plugin + AGENTS.md) |
| **OpenClaw** | `npx -y github:ivan-neves/ieee-paper-writer -- --only openclaw` | Yes (workspace skill + SOUL.md) |
| **Codex CLI** | `npx skills add ivan-neves/ieee-paper-writer -a codex` | Per-session: `/ieee-paper-writer` |
| **Cursor** | `npx skills add ivan-neves/ieee-paper-writer -a cursor` | Per-session by default; `--with-init` for an always-on rule file |
| **Windsurf** | `npx skills add ivan-neves/ieee-paper-writer -a windsurf` | Per-session by default; `--with-init` for an always-on rule file |
| **Cline** | `npx skills add ivan-neves/ieee-paper-writer -a cline` | Per-session by default; `--with-init` for an always-on rule file |
| **GitHub Copilot** *(soft probe)* | `npx -y github:ivan-neves/ieee-paper-writer -- --only copilot --with-init` | Repo-wide instructions via `--with-init` |
| **Continue** | `npx skills add ivan-neves/ieee-paper-writer -a continue` | No — say `/ieee-paper-writer` |
| **Kilo Code** | `npx skills add ivan-neves/ieee-paper-writer -a kilo` | No |
| **Roo Code** | `npx skills add ivan-neves/ieee-paper-writer -a roo` | No |
| **Augment Code** | `npx skills add ivan-neves/ieee-paper-writer -a augment` | No |
| **Aider Desk** | `npx skills add ivan-neves/ieee-paper-writer -a aider-desk` | No |
| **Sourcegraph Amp** | `npx skills add ivan-neves/ieee-paper-writer -a amp` | No |
| **IBM Bob** | `npx skills add ivan-neves/ieee-paper-writer -a bob` | No |
| **Crush** | `npx skills add ivan-neves/ieee-paper-writer -a crush` | No |
| **Devin (terminal)** | `npx skills add ivan-neves/ieee-paper-writer -a devin` | No |
| **Droid (Factory)** | `npx skills add ivan-neves/ieee-paper-writer -a droid` | No |
| **ForgeCode** | `npx skills add ivan-neves/ieee-paper-writer -a forgecode` | No |
| **Block Goose** | `npx skills add ivan-neves/ieee-paper-writer -a goose` | No |
| **iFlow CLI** | `npx skills add ivan-neves/ieee-paper-writer -a iflow-cli` | No |
| **Kiro CLI** | `npx skills add ivan-neves/ieee-paper-writer -a kiro-cli` | No |
| **Mistral Vibe** | `npx skills add ivan-neves/ieee-paper-writer -a mistral-vibe` | No |
| **OpenHands** | `npx skills add ivan-neves/ieee-paper-writer -a openhands` | No |
| **Qwen Code** | `npx skills add ivan-neves/ieee-paper-writer -a qwen-code` | No |
| **Atlassian Rovo Dev** | `npx skills add ivan-neves/ieee-paper-writer -a rovodev` | No |
| **Tabnine CLI** | `npx skills add ivan-neves/ieee-paper-writer -a tabnine-cli` | No |
| **Trae** | `npx skills add ivan-neves/ieee-paper-writer -a trae` | No |
| **Warp** | `npx skills add ivan-neves/ieee-paper-writer -a warp` | No |
| **Replit Agent** | `npx skills add ivan-neves/ieee-paper-writer -a replit` | No |
| **JetBrains Junie** *(soft probe)* | `npx skills add ivan-neves/ieee-paper-writer -a junie` | No |
| **Qoder** *(soft probe)* | `npx skills add ivan-neves/ieee-paper-writer -a qoder` | No |
| **Google Antigravity** *(soft probe)* | `npx skills add ivan-neves/ieee-paper-writer -a antigravity` | No |

"Soft probe" = installer won't auto-detect these without `--only <id>` because there's no reliable always-on signal (Copilot subscription state is auth-gated; the others have no CLI / config-dir-only). Pass the flag when you want them.

For "auto-activates? No" agents, type `/ieee-paper-writer` once per session (or describe what you want to write — paper-writing triggers activate the pipeline automatically).

**Finding a profile slug for `npx skills add ... -a <profile>`?** Either read the table above, or print the live matrix from the installer:

```bash
bash install.sh --list             # macOS / Linux / WSL, from a local clone
pwsh install.ps1 --list            # Windows / PowerShell, from a local clone
node bin/install.js --list         # any platform, from a local clone
npx -y github:ivan-neves/ieee-paper-writer -- --list   # no clone needed
```

## Manual install (no `curl | bash`)

If you'd rather see exactly what runs:

```bash
# Clone the repo
git clone https://github.com/ivan-neves/ieee-paper-writer.git
cd ieee-paper-writer

# Preview every command the installer would run
node bin/install.js --dry-run --all

# Inspect the agent matrix
node bin/install.js --list

# Install for everything detected
node bin/install.js --all
```

Useful flags:

| Flag | What |
|---|---|
| `--all` | Plugin + hooks + per-repo rule files in `$PWD`. |
| `--minimal` | Plugin / extension only. No hooks, no per-repo rules. |
| `--only <id>` | One agent only. Repeatable: `--only claude --only cursor`. |
| `--dry-run` | Print every command. Write nothing. |
| `--with-init` | Drop always-on rule files into the current repo (`.cursor/`, `.windsurf/`, `.clinerules/`, `.github/copilot-instructions.md`, `.opencode/AGENTS.md`, `AGENTS.md`). |
| `--with-hooks` / `--no-hooks` | Force-on or force-off the Claude Code hook installer. (Default: on.) |
| `--skip-skills` | Don't run the npx-skills auto-detect fallback when nothing else matched. |
| `--config-dir <path>` | Claude Code config dir for hook files + `settings.json`. Default: `$CLAUDE_CONFIG_DIR` or `~/.claude`. |
| `--non-interactive` | Never prompt; use defaults. (Auto when stdin is not a TTY.) |
| `--no-color` | Disable ANSI colors. |
| `--list` | Print full agent matrix and exit. |
| `--force` | Re-run even if already installed. |
| `--uninstall` | Remove everything. See below. |

## Always-on rules

For agents without a hook system (Cursor, Windsurf, Cline, Copilot, and friends), the always-on path is a static rule file. Two ways:

```bash
# Drop rule files into the current repo
node bin/install.js --with-init

# Or pull the rule body straight in (manual)
curl -fsSL https://raw.githubusercontent.com/ivan-neves/ieee-paper-writer/main/src/rules/ieee-paper-activate.md \
  > .cursor/rules/ieee-paper-writer.mdc
  # or .windsurf/rules/ieee-paper-writer.md, .clinerules/ieee-paper-writer.md, etc.
```

`--with-init` writes the rule into every supported per-agent location it can detect. Single source: [`src/rules/ieee-paper-activate.md`](src/rules/ieee-paper-activate.md).

## Verify

After install, two quick checks:

**1. See what got installed.**

```bash
node bin/install.js --list
```

**2. Talk to Claude Code.**

Open Claude Code, type `/ieee-paper-writer Introduction section for a paper on distributed optimization`. The pipeline should run all four stages and return a Final Text block.

## Uninstall

```bash
npx -y github:ivan-neves/ieee-paper-writer -- --uninstall
```

What it removes:

- ieee-paper-writer hook entries from `$CLAUDE_CONFIG_DIR/settings.json`.
- Hook files in `$CLAUDE_CONFIG_DIR/hooks/` (`ieee-paper-activate.js`, `ieee-paper-tracker.js`, plus the dir's `package.json` marker).
- The Claude Code plugin and the Gemini CLI extension (if installed).
- The opencode native plugin.
- The OpenClaw workspace skill folder and the marker-fenced block from `~/.openclaw/workspace/SOUL.md` (when present).

What it does **not** remove:

- Skills installed via `npx skills add` — the `skills` CLI manages those. Run `npx skills remove ieee-paper-writer`.
- Per-repo rule files written by `--with-init`. Delete by hand if you want.

## Troubleshooting

**"Install script broke. What now?"**

Open your agent in this repo and say:

> "Read CLAUDE.md and INSTALL.md, install ieee-paper-writer for me."

The agent reads the maintainer guide and runs the install steps itself.

**"Pipeline didn't run."**

Check that the plugin is installed: `claude plugin list`. If missing, re-run the one-liner.
For agents without hooks, type `/ieee-paper-writer` explicitly to trigger the pipeline.
