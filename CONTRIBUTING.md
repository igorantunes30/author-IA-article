# Contributing to ieee-paper-writer

Thanks for considering a contribution. ieee-paper-writer is a four-agent pipeline that transforms raw notes and drafts into peer-review-quality academic manuscripts for IEEE, Elsevier, Springer, ACM, Nature Portfolio, and Qualis A journals. Most contributions fall into one of three buckets:

1. **Editing agent prose** — change how an agent stage writes, what it checks, what it fixes.
2. **Adding a new agent** — wire a fresh editor/CLI/IDE into the unified installer.
3. **Fixing the hooks or installer** — Claude Code hooks, the Node installer, the sync workflow.

Small focused PR preferred over large rewrites.

---

## Quick orientation

The pipeline ships as a Claude Code plugin plus skill files for 30+ agents (Codex, Gemini, Cursor, Windsurf, Cline, Copilot, opencode, and others). A single Node installer at `bin/install.js` detects which agents are on the user's machine and installs the right thing for each.

Sources of truth live at the **top level** of the repo. Agent-specific copies live under `plugins/ieee-paper-writer/` — those are **rebuilt by CI** and edits there are reverted.

---

## What to edit (sources of truth)

| I want to change... | Edit this file |
|---|---|
| Pipeline orchestration, stage routing, output format | `skills/ieee-paper-writer/SKILL.md` |
| Stage 1 — Author behavior (paragraph structure, verbs, voice) | `agents/ieee-paper-author.md` |
| Stage 2 — Editorial behavior (rhythm, connectors, redundancy) | `agents/ieee-paper-editorial.md` |
| Stage 3 — IEEE Style behavior (impersonality, acronyms, forbidden constructions) | `agents/ieee-paper-style.md` |
| Stage 4 — Reviewer behavior (peer review dimensions, report format) | `agents/ieee-paper-reviewer.md` |
| Auto-activation rule body (Cursor/Windsurf/Cline/Copilot) | `src/rules/ieee-paper-activate.md` |
| Add support for a new agent | `bin/install.js` (PROVIDERS array) |
| Claude Code hooks | `src/hooks/ieee-paper-activate.js`, `src/hooks/ieee-paper-tracker.js` |
| Settings.json read/write helpers | `bin/lib/settings.js` |

That's it. Every other file with `SKILL.md` in the path under `plugins/` is a copy.

---

## What NOT to edit (CI-generated mirrors)

Edits to these files are wiped by the next CI run. The `.github/workflows/sync-skill.yml` job rebuilds them from the sources above on every push to `main`.

| Path | Rebuilt from |
|------|--------------|
| `plugins/ieee-paper-writer/skills/ieee-paper-writer/SKILL.md` | `skills/ieee-paper-writer/SKILL.md` |
| `plugins/ieee-paper-writer/agents/ieee-paper-*.md` | `agents/ieee-paper-*.md` |
| `dist/ieee-paper-writer.skill` | ZIP of `skills/ieee-paper-writer/` (CI-rebuilt on push) |

When in doubt: if the file lives under `plugins/`, `dist/`, or any agent dotdir mirror, it is a build artifact. Edit the top-level source instead.

---

## Adding a new agent

The unified Node installer at `bin/install.js` is the **single source of truth** for the supported-agent list. The README and `INSTALL.md` install tables mirror it by hand — bash and PowerShell shims at the repo root just delegate to it.

1. Confirm the agent has a distribution path (vercel-labs/skills slug, native plugin, rule-file mechanism).
2. Append a row to the `PROVIDERS` array in `bin/install.js`. Each row needs:
   - `id` — short kebab-case identifier
   - `label` — human display name
   - `mech` — distribution mechanism (`plugin`, `extension`, `rules-file`, `skills-cli`, ...)
   - `detect` — clause spec describing how to detect the agent
   - `profile` — the vercel-labs/skills slug, if applicable
   - `soft: true` — when detection is config-dir-only
3. Run `node bin/install.js --list` and confirm the new row renders correctly.
4. Add a row to the install tables in `README.md` and `INSTALL.md`.

---

## Adding a new skill

1. Create `skills/<name>/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: <name>
   description: <one sentence, present tense>
   ---
   ```
2. Create `skills/<name>/README.md` — human-facing summary, install hint, example.
3. If the skill should be in the Claude Code plugin, add a sync step to `.github/workflows/sync-skill.yml`.
4. If it is user-invocable as a slash command, add a row to the slash-command table in `README.md` and `INSTALL.md`.
5. Add an eval prompt to `evals/prompts/en.txt` if you want the eval harness to score it.

---

## Running tests

```bash
# Installer unit + e2e tests (Node)
npm test

# Compress-skill safety tests (Python)
python3 -m unittest tests.test_compress_safety

# Flag-file symlink-safety tests
node tests/test_symlink_flag.js
```

CI runs all of the above on every PR.

---

## Running benchmarks and evals

```bash
uv run python benchmarks/run.py     # needs ANTHROPIC_API_KEY in .env.local
python evals/llm_run.py             # regenerates evals/snapshots/results.json
python evals/measure.py             # reads snapshot, prints token deltas
```

Snapshots are committed to git. Only regenerate when a `SKILL.md` or `evals/prompts/en.txt` changes.

---

## Pull-request guidelines

- **Conventional Commits** for the commit subject.
- **One concern per PR.** A README copy-edit and an installer fix go in separate PRs.
- **Update `package.json` `files`** if you add a new top-level directory the installer needs.
- **Show before/after** for prose changes to any `SKILL.md`. One sentence on why the new wording is better.
- **Mention the CI sync.** If you edited a source-of-truth file, note it so reviewers know CI will resync.

---

## Code style

- **Hooks must silent-fail on filesystem errors.** A `try/catch` that swallows the error is correct here. A hook that throws blocks Claude Code session start.
- **Settings.json reads and writes go through `bin/lib/settings.js`.** It tolerates JSONC comments. Direct `JSON.parse` on a user's `settings.json` will crash on a single `// comment`.
- **Validate hook entries before writing.** Use `validateHookFields()` in `bin/lib/settings.js`.
- **Honor `CLAUDE_CONFIG_DIR`.** Hooks, the installer, and statusline scripts must respect it — never hardcode `~/.claude`.
- **`install.sh` and `install.ps1` at the repo root are shims** that delegate to `bin/install.js`.

---

## Ideas

See [issues labeled `good first issue`](../../issues?q=label%3A%22good+first+issue%22) for starter tasks. Or grep `TODO` / `FIXME` in `src/hooks/`, `bin/`, `src/tools/`.
