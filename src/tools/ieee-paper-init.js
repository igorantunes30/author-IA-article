#!/usr/bin/env node
// ieee-paper-writer init — drop the always-on pipeline activation rule into a
// target repo for every IDE agent we support. Idempotent. Safe to re-run.
//
// Usage:
//   node src/tools/ieee-paper-init.js [target-dir] [--dry-run] [--force] [--only <agent>]
//   curl -fsSL https://raw.githubusercontent.com/igorantunes30/author-IA-article/main/src/tools/ieee-paper-init.js | node - [args]
//
// Without args, runs in cwd. Generates rule files for Cursor, Windsurf,
// Cline, Copilot, and AGENTS.md. Does NOT modify CLAUDE.md.

const fs = require('fs');
const path = require('path');

// Embedded so the tool works standalone (npx-style) without the src/rules/ dir.
// Mirrors src/rules/ieee-paper-activate.md verbatim — keep these in sync.
const RULE_BODY = `IEEE-PAPER-WRITER ACTIVE. Four-agent pipeline: Author → Editorial → IEEE Style → Reviewer.
Manuscript output always in formal academic English.

Pipeline stages:
1. Author — writes a complete, rigorous technical draft
2. Editorial — refines fluency, rhythm, and paragraph structure
3. IEEE Style — enforces IEEE conventions (voice, impersonality, acronyms)
4. Reviewer — anonymous peer review: ambiguity, redundancy, unsupported claims

Activate: /ieee-paper-writer or describe the section you want to write.
`;

const SENTINEL = 'IEEE-PAPER-WRITER ACTIVE';

function loadOpenclawHelper() {
  try {
    return require(path.join(__dirname, '..', '..', 'bin', 'lib', 'openclaw.js'));
  } catch (_) { return null; }
}

const AGENTS = [
  { id: 'cursor',   file: '.cursor/rules/ieee-paper-writer.mdc',
    frontmatter: '---\ndescription: "ieee-paper-writer — four-agent pipeline for IEEE/Elsevier/Springer manuscripts"\nalwaysApply: true\n---\n\n',
    mode: 'replace' },
  { id: 'windsurf', file: '.windsurf/rules/ieee-paper-writer.md',
    frontmatter: '---\ntrigger: always_on\n---\n\n',
    mode: 'replace' },
  { id: 'cline',    file: '.clinerules/ieee-paper-writer.md',
    frontmatter: '',
    mode: 'replace' },
  { id: 'copilot',  file: '.github/copilot-instructions.md',
    frontmatter: '',
    mode: 'append' },
  { id: 'opencode', file: '.opencode/AGENTS.md',
    frontmatter: '',
    mode: 'append' },
  { id: 'agents',   file: 'AGENTS.md',
    frontmatter: '',
    mode: 'append' },
  { id: 'openclaw', description: '~/.openclaw/workspace/{skills/ieee-paper-writer/, SOUL.md}',
    installer: 'openclaw' },
];

function loadRuleBody() {
  try {
    const local = path.join(__dirname, '..', 'rules', 'ieee-paper-activate.md');
    if (fs.existsSync(local)) return fs.readFileSync(local, 'utf8').trimEnd() + '\n';
  } catch (e) {}
  return RULE_BODY;
}

function processAgent(agent, targetDir, ruleBody, opts) {
  if (agent.installer === 'openclaw') {
    return processOpenclaw(opts);
  }
  const fullPath = path.join(targetDir, agent.file);
  const exists = fs.existsSync(fullPath);

  if (!exists) {
    if (!opts.dryRun) {
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, agent.frontmatter + ruleBody, { mode: 0o644 });
    }
    return { status: 'added', label: '+' };
  }

  const existing = fs.readFileSync(fullPath, 'utf8');
  if (existing.includes(SENTINEL)) {
    return { status: 'skipped-already-installed', label: '=' };
  }

  if (agent.mode === 'append') {
    if (!opts.dryRun) {
      const sep = existing.endsWith('\n\n') ? '' : (existing.endsWith('\n') ? '\n' : '\n\n');
      fs.writeFileSync(fullPath, existing + sep + ruleBody, { mode: 0o644 });
    }
    return { status: 'appended', label: '~' };
  }

  if (opts.force) {
    if (!opts.dryRun) {
      fs.writeFileSync(fullPath, agent.frontmatter + ruleBody, { mode: 0o644 });
    }
    return { status: 'overwritten', label: '!' };
  }

  return { status: 'skipped-exists', label: '?' };
}

function processOpenclaw(opts) {
  const helper = loadOpenclawHelper();
  if (!helper) {
    return {
      status: 'unsupported-standalone',
      label: 'x',
      detail: '~/.openclaw/workspace (helper unavailable in standalone curl|node mode — use `npx -y github:igorantunes30/author-IA-article -- --only openclaw`)',
    };
  }
  const repoRoot = path.resolve(__dirname, '..', '..');
  const log = { write: (_) => {}, note: (_) => {}, warn: (_) => {} };
  const r = helper.installOpenclaw({
    workspace: process.env.OPENCLAW_WORKSPACE || undefined,
    repoRoot,
    dryRun: opts.dryRun,
    force: opts.force,
    log,
  });
  if (!r.ok) {
    return { status: 'skipped-' + (r.reason || 'failed'), label: '?', detail: helper.resolveWorkspace ? helper.resolveWorkspace() : '~/.openclaw/workspace' };
  }
  if (r.dryRun) return { status: 'would-add', label: '+', detail: helper.resolveWorkspace() };
  return { status: 'installed', label: '+', detail: helper.resolveWorkspace() };
}

function parseArgs(argv) {
  const opts = { dryRun: false, force: false, only: null, target: process.cwd() };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--force' || a === '-f') opts.force = true;
    else if (a === '--only') { opts.only = argv[++i]; }
    else if (a === '-h' || a === '--help') opts.help = true;
    else if (!a.startsWith('-')) opts.target = path.resolve(a);
  }
  return opts;
}

function help() {
  console.log(`ieee-paper-writer init — drop always-on pipeline rule into a target repo

Usage: ieee-paper-init.js [target-dir] [--dry-run] [--force] [--only <agent>]

Defaults to current working directory. Idempotent — safe to re-run.

Targets installed:
${AGENTS.map(a => `  ${a.id.padEnd(10)} ${a.file || a.description || ''}`).join('\n')}

Flags:
  --dry-run   show what would change, do not write
  --force     overwrite existing rule files (default: skip)
  --only <id> only install for one agent (id from list above)
`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) { help(); return; }

  console.log(`ieee-paper-writer init — ${opts.target}${opts.dryRun ? ' (dry run)' : ''}\n`);

  const ruleBody = loadRuleBody();
  const counts = { added: 0, appended: 0, overwritten: 0, skipped: 0 };

  for (const agent of AGENTS) {
    if (opts.only && opts.only !== agent.id) continue;
    const result = processAgent(agent, opts.target, ruleBody, opts);
    const target = agent.file || result.detail || agent.description || agent.id;
    console.log(`  ${result.label} ${target} (${result.status})`);
    if (result.status === 'added' || result.status === 'installed' || result.status === 'would-add') counts.added++;
    else if (result.status === 'appended') counts.appended++;
    else if (result.status === 'overwritten') counts.overwritten++;
    else counts.skipped++;
  }

  console.log(`\n${counts.added} added, ${counts.appended} appended, ` +
              `${counts.overwritten} overwritten, ${counts.skipped} skipped`);
  if (opts.dryRun) console.log('(dry run — no files were written)');
}

if (require.main === module) main();

module.exports = { processAgent, loadRuleBody, AGENTS, SENTINEL, RULE_BODY };
