# CLAUDE.md — ieee-paper-writer

## README is a product artifact

README = product front door. Non-technical people read it to decide if ieee-paper-writer worth install. Treat like UI copy.

**Rules for any README change:**

- Readable by non-AI-agent users.
- Keep Before/After examples first. That the pitch.
- Install table always complete + accurate.
- Pipeline diagram must reflect actual 4-stage flow.
- Links to ivan-neves/ieee-paper-writer.
- Never reference caveman, JuliusBrussee, author compression, token savings, or terse mode.

---

## Project overview

ieee-paper-writer is a four-agent pipeline that transforms raw notes, bullet points, or rough drafts into peer-review-quality academic manuscripts for IEEE, Elsevier, Springer, ACM, Nature Portfolio, and Qualis A journals.

Ships as a Claude Code plugin with hooks for Claude Code, Codex, Gemini, Cursor, Windsurf, Cline, Copilot, opencode, OpenClaw, and 30+ other agents.

---

## What lives where

```
ieee-paper-writer/
├── README.md                        # Front door (product pitch)
├── INSTALL.md                       # Per-agent install commands
├── CONTRIBUTING.md                  # Dev guide
├── CLAUDE.md                        # This file (maintainer instructions)
├── AGENTS.md / GEMINI.md            # Auto-discovery: @./skills/ieee-paper-writer/SKILL.md
│
├── install.sh / install.ps1         # Shims → bin/install.js
│
├── bin/                             # Unified installer
│   ├── install.js                   # Single source for all 30+ agents (PROVIDERS array)
│   └── lib/settings.js              # JSONC-tolerant settings.json reader/writer
│
├── skills/                          # ALL skills, single source of truth
│   └── ieee-paper-writer/
│       ├── SKILL.md                 # Main skill: 4-agent pipeline orchestrator
│       └── README.md                # Human-facing skill description
│
├── agents/                          # Pipeline agents (single source)
│   ├── ieee-paper-author.md         # Stage 1: writes complete technical draft
│   ├── ieee-paper-editorial.md      # Stage 2: refines fluency and rhythm
│   ├── ieee-paper-style.md          # Stage 3: enforces IEEE conventions
│   └── ieee-paper-reviewer.md       # Stage 4: anonymous peer review
│
├── commands/
│   └── ieee-paper-writer.toml       # Codex/Gemini command stub
│
├── .claude-plugin/
│   ├── plugin.json                  # Claude Code plugin manifest
│   └── marketplace.json             # Marketplace listing
│
├── plugins/ieee-paper-writer/       # Claude Code plugin distribution (CI-mirrored)
│   ├── skills/ieee-paper-writer/    # ← from skills/ieee-paper-writer/
│   └── agents/                      # ← from agents/
│
├── src/
│   ├── hooks/
│   │   ├── ieee-paper-activate.js   # SessionStart hook: injects SKILL.md as context
│   │   ├── ieee-paper-tracker.js    # UserPromptSubmit hook: detects paper-writing triggers
│   │   ├── install.sh / install.ps1 # Hook installer scripts
│   │   ├── uninstall.sh / uninstall.ps1
│   │   ├── package.json             # CJS marker for hook directory
│   │   └── checksums.sha256         # SHA-256 manifest for remote hook downloads
│   ├── rules/
│   │   └── ieee-paper-activate.md   # Always-on rule body for --with-init
│   └── plugins/
│       └── opencode/
│           ├── plugin.js            # opencode native plugin
│           ├── package.json
│           └── commands/
│               └── ieee-paper-writer.md
│
├── dist/ieee-paper-writer.skill     # ZIP of skills/ieee-paper-writer/ (CI-built)
├── benchmarks/                      # Token counts from real API runs
├── evals/                           # Three-arm eval harness
├── tests/                           # Node + Python tests
├── docs/                            # User-facing docs
└── .github/workflows/sync-skill.yml # CI: syncs skills→plugins, rebuilds dist/
```

---

## Single source of truth files — edit only these

| File | What it controls |
|------|-----------------|
| `skills/ieee-paper-writer/SKILL.md` | Pipeline orchestration: stage routing, invariants, output format, language rules. Only file to edit for pipeline behavior changes. |
| `agents/ieee-paper-author.md` | Stage 1 behavior: paragraph structure, vocabulary, verbs, voice, rhythm, acronyms, forbidden/preferred constructions. |
| `agents/ieee-paper-editorial.md` | Stage 2 behavior: rhythm pass, connector audit, redundancy removal, fluency, paragraph integrity. |
| `agents/ieee-paper-style.md` | Stage 3 behavior: impersonality, voice balance, terminological consistency, acronym protocol, forbidden constructions, precision vocabulary. |
| `agents/ieee-paper-reviewer.md` | Stage 4 behavior: reviewer authority, review dimensions (ambiguity/redundancy/unsupported claims/coherence/structure), output format. |
| `src/hooks/ieee-paper-activate.js` | SessionStart hook: reads SKILL.md and emits it as hidden context. |
| `src/hooks/ieee-paper-tracker.js` | UserPromptSubmit hook: detects paper-writing triggers, injects pipeline reminder. |
| `src/rules/ieee-paper-activate.md` | Always-on rule body written by `--with-init` to per-repo rule files. |
| `bin/install.js` | Unified installer. PROVIDERS array is single source for all agents. |

## Auto-generated / auto-synced — do not edit directly

| File | Synced from |
|------|-------------|
| `plugins/ieee-paper-writer/skills/ieee-paper-writer/SKILL.md` | `skills/ieee-paper-writer/SKILL.md` |
| `plugins/ieee-paper-writer/agents/ieee-paper-*.md` | `agents/ieee-paper-*.md` |
| `dist/ieee-paper-writer.skill` | ZIP of `skills/ieee-paper-writer/` (CI-rebuilt on push) |

---

## CI sync workflow

`.github/workflows/sync-skill.yml` triggers on main push when `skills/ieee-paper-writer/SKILL.md` or `agents/ieee-paper-*.md` changes.

What it does:
1. Copies `skills/ieee-paper-writer/SKILL.md` into `plugins/ieee-paper-writer/skills/ieee-paper-writer/`.
2. Copies `agents/ieee-paper-*.md` into `plugins/ieee-paper-writer/agents/`.
3. Rebuilds `dist/ieee-paper-writer.skill` (ZIP of `skills/ieee-paper-writer/`).
4. Commits and pushes with `[skip ci]`.

---

## Hook system (Claude Code)

Two hooks in `src/hooks/`. No flag file — ieee-paper-writer is always-on, not a toggle.

### `src/hooks/ieee-paper-activate.js` — SessionStart hook

Reads `skills/ieee-paper-writer/SKILL.md` and emits the body (without frontmatter) as hidden stdout. Claude Code injects SessionStart hook stdout as system context. Falls back to a minimal description if SKILL.md is not found.

### `src/hooks/ieee-paper-tracker.js` — UserPromptSubmit hook

Reads JSON from stdin. Matches paper-writing triggers (regex list). When matched, emits `hookSpecificOutput` JSON with pipeline stage summary, keeping the pipeline visible in model attention per turn.

**Triggers matched:** `/ieee-paper-writer`, `/ieee-paper`, "write the introduction", "draft the methodology", "peer review this", "rewrite in IEEE style", "make this more scientific", pasting a rough draft with academic language.

Both hooks silent-fail on all filesystem errors. Never block session start.

---

## Key rules for agents working here

- Edit `skills/ieee-paper-writer/SKILL.md` for pipeline orchestration changes. Never edit synced copies under `plugins/`.
- Edit `agents/ieee-paper-*.md` for individual stage behavior. Never edit copies under `plugins/agents/`.
- Edit `src/rules/ieee-paper-activate.md` for always-on rule changes. Never edit per-repo copies on user machines.
- Scientific content (equations, numerical values, citations) is invariant across all four stages — preserve this guarantee in any agent edit.
- Manuscript output is always formal academic English regardless of user input language.
- No references to caveman, JuliusBrussee, author mode, token compression, or terse style anywhere in this codebase.
- `bin/install.js` is the only installer source. `install.sh` / `install.ps1` at repo root are shims.
- Any settings.json read must go through `bin/lib/settings.js` `readSettings()` for JSONC tolerance.
- CI commits back to main after merge. Wait for workflow before declaring release complete.
