// opencode native install — fresh install, idempotency, uninstall, plugin smoke.
//
// Detection of opencode is gated behind `command -v opencode`, so to run on a
// CI box without opencode installed we prepend a tmpdir with a no-op `opencode`
// shim to PATH.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..', '..');
const INSTALLER = path.join(REPO_ROOT, 'bin', 'install.js');
const requireCjs = createRequire(import.meta.url);
const SETTINGS = requireCjs(path.join(REPO_ROOT, 'bin', 'lib', 'settings.js'));

const IS_WIN = process.platform === 'win32';

function freshTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ieee-paper-opencode-'));
}

function shimOpencode() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cm-shim-'));
  if (IS_WIN) {
    fs.writeFileSync(path.join(dir, 'opencode.cmd'), '@echo off\r\n');
  } else {
    const f = path.join(dir, 'opencode');
    fs.writeFileSync(f, '#!/bin/sh\nexit 0\n');
    fs.chmodSync(f, 0o755);
  }
  return dir;
}

function runInstaller(args, env) {
  return spawnSync('node', [INSTALLER, ...args, '--non-interactive', '--no-mcp-shrink'], {
    env, encoding: 'utf8',
  });
}

function pathWith(prependDir) {
  const sep = IS_WIN ? ';' : ':';
  return prependDir + sep + (process.env.PATH || '');
}

// ── 1. Fresh install populates expected files ────────────────────────────
test('opencode fresh install drops plugin, commands, agents, skills, AGENTS.md, opencode.json', () => {
  const xdg = freshTmpDir();
  const shimDir = shimOpencode();
  try {
    const r = runInstaller(['--only', 'opencode'], {
      ...process.env,
      XDG_CONFIG_HOME: xdg,
      PATH: pathWith(shimDir),
      NO_COLOR: '1',
    });
    assert.notEqual(r.status, 2, `argv error: ${r.stderr}`);

    const ocDir = path.join(xdg, 'opencode');
    assert.ok(fs.existsSync(path.join(ocDir, 'plugins', 'ieee-paper-writer', 'plugin.js')), 'plugin.js missing');
    assert.ok(fs.existsSync(path.join(ocDir, 'plugins', 'ieee-paper-writer', 'package.json')), 'plugin package.json missing');

    for (const f of ['ieee-paper-writer.md']) {
      assert.ok(fs.existsSync(path.join(ocDir, 'commands', f)), `command ${f} missing`);
    }
    for (const f of ['ieee-paper-author.md', 'ieee-paper-editorial.md', 'ieee-paper-style.md', 'ieee-paper-reviewer.md']) {
      assert.ok(fs.existsSync(path.join(ocDir, 'agents', f)), `agent ${f} missing`);
    }
    for (const name of ['ieee-paper-writer']) {
      assert.ok(fs.existsSync(path.join(ocDir, 'skills', name, 'SKILL.md')), `skill ${name}/SKILL.md missing`);
    }
    assert.ok(fs.existsSync(path.join(ocDir, 'AGENTS.md')), 'AGENTS.md missing');
    const agentsBody = fs.readFileSync(path.join(ocDir, 'AGENTS.md'), 'utf8');
    assert.match(agentsBody, /IEEE-PAPER-WRITER ACTIVE/);
    assert.match(agentsBody, /<!-- ieee-paper-begin -->/);
    assert.match(agentsBody, /<!-- ieee-paper-end -->/);

    const cfgPath = path.join(ocDir, 'opencode.json');
    assert.ok(fs.existsSync(cfgPath), 'opencode.json missing');
    const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    assert.ok(Array.isArray(cfg.plugin), 'opencode.json missing plugin array');
    assert.ok(cfg.plugin.includes('./plugins/ieee-paper-writer/plugin.js'), 'plugin entry missing');
  } finally {
    fs.rmSync(xdg, { recursive: true, force: true });
    fs.rmSync(shimDir, { recursive: true, force: true });
  }
});

// ── 2. Idempotency: install twice, plugin array stays length 1 ───────────
test('opencode idempotent install does not duplicate plugin entries', () => {
  const xdg = freshTmpDir();
  const shimDir = shimOpencode();
  try {
    const env = { ...process.env, XDG_CONFIG_HOME: xdg, PATH: pathWith(shimDir), NO_COLOR: '1' };
    const r1 = runInstaller(['--only', 'opencode'], env);
    assert.notEqual(r1.status, 2);
    const r2 = runInstaller(['--only', 'opencode'], env);
    assert.notEqual(r2.status, 2);

    const cfg = JSON.parse(fs.readFileSync(path.join(xdg, 'opencode', 'opencode.json'), 'utf8'));
    const matches = cfg.plugin.filter(p => p === './plugins/ieee-paper-writer/plugin.js');
    assert.equal(matches.length, 1, `expected 1 plugin entry, got ${matches.length}`);

    const agentsMd = fs.readFileSync(path.join(xdg, 'opencode', 'AGENTS.md'), 'utf8');
    const sentinelCount = (agentsMd.match(/IEEE-PAPER-WRITER ACTIVE/g) || []).length;
    assert.equal(sentinelCount, 1, `expected 1 sentinel, got ${sentinelCount}`);
  } finally {
    fs.rmSync(xdg, { recursive: true, force: true });
    fs.rmSync(shimDir, { recursive: true, force: true });
  }
});

// ── 2b. Plugin payload not overwritten on re-install (without --force) ────
test('opencode re-install preserves user edits to plugin.js without --force', () => {
  const xdg = freshTmpDir();
  const shimDir = shimOpencode();
  try {
    const env = { ...process.env, XDG_CONFIG_HOME: xdg, PATH: pathWith(shimDir), NO_COLOR: '1' };
    const r1 = runInstaller(['--only', 'opencode'], env);
    assert.notEqual(r1.status, 2);

    const pluginPath = path.join(xdg, 'opencode', 'plugins', 'ieee-paper-writer', 'plugin.js');
    const tweak = '\n// USER-TWEAK-DO-NOT-OVERWRITE\n';
    fs.appendFileSync(pluginPath, tweak);
    const beforeBytes = fs.readFileSync(pluginPath, 'utf8');

    const r2 = runInstaller(['--only', 'opencode'], env);
    assert.notEqual(r2.status, 2);

    const afterBytes = fs.readFileSync(pluginPath, 'utf8');
    assert.equal(afterBytes, beforeBytes, 'second install should not overwrite plugin.js without --force');
    assert.match(afterBytes, /USER-TWEAK-DO-NOT-OVERWRITE/);

    const r3 = runInstaller(['--only', 'opencode', '--force'], env);
    assert.notEqual(r3.status, 2);
    const forced = fs.readFileSync(pluginPath, 'utf8');
    assert.doesNotMatch(forced, /USER-TWEAK-DO-NOT-OVERWRITE/, '--force should overwrite plugin.js');
  } finally {
    fs.rmSync(xdg, { recursive: true, force: true });
    fs.rmSync(shimDir, { recursive: true, force: true });
  }
});

// ── 2c. AGENTS.md fence preserves user content above and below ───────────
test('opencode uninstall strips fenced AGENTS.md block, preserving user prefix and suffix', () => {
  const xdg = freshTmpDir();
  const shimDir = shimOpencode();
  try {
    const env = { ...process.env, XDG_CONFIG_HOME: xdg, PATH: pathWith(shimDir), NO_COLOR: '1' };
    const r1 = runInstaller(['--only', 'opencode'], env);
    assert.notEqual(r1.status, 2);

    const agentsMd = path.join(xdg, 'opencode', 'AGENTS.md');
    const installed = fs.readFileSync(agentsMd, 'utf8');
    // Sandwich the ieee-paper-writer block between user prefix and suffix.
    const userPrefix = '# my project\n\nuse 2-space indent.\n\n';
    const userSuffix = '\n## extra\n\nkeep PRs small.\n';
    fs.writeFileSync(agentsMd, userPrefix + installed.trimEnd() + '\n' + userSuffix);

    const r2 = runInstaller(['--uninstall'], env);
    assert.notEqual(r2.status, 2);

    const after = fs.readFileSync(agentsMd, 'utf8');
    assert.doesNotMatch(after, /<!-- ieee-paper-begin -->/, 'ieee-paper-writer block should be stripped');
    assert.doesNotMatch(after, /<!-- ieee-paper-end -->/, 'ieee-paper-writer end marker should be stripped');
    assert.doesNotMatch(after, /IEEE-PAPER-WRITER ACTIVE/, 'ieee-paper-writer body should be stripped');
    assert.match(after, /# my project/, 'user prefix should survive');
    assert.match(after, /use 2-space indent/, 'user prefix body should survive');
    assert.match(after, /## extra/, 'user suffix should survive');
    assert.match(after, /keep PRs small/, 'user suffix body should survive');
  } finally {
    fs.rmSync(xdg, { recursive: true, force: true });
    fs.rmSync(shimDir, { recursive: true, force: true });
  }
});

// ── 3. Tolerates JSONC opencode.json (#249-class regression guard) ───────
test('opencode install tolerates JSONC opencode.json (comments + trailing commas)', () => {
  const xdg = freshTmpDir();
  const shimDir = shimOpencode();
  try {
    const ocDir = path.join(xdg, 'opencode');
    fs.mkdirSync(ocDir, { recursive: true });
    fs.writeFileSync(path.join(ocDir, 'opencode.json'),
      `// hand-written
{
  /* user prefs */
  "model": "anthropic/claude-sonnet-4-5",
  "theme": "dark",
}
`);

    const env = { ...process.env, XDG_CONFIG_HOME: xdg, PATH: pathWith(shimDir), NO_COLOR: '1' };
    const r = runInstaller(['--only', 'opencode'], env);
    assert.notEqual(r.status, 2);

    const cfg = JSON.parse(fs.readFileSync(path.join(ocDir, 'opencode.json'), 'utf8'));
    assert.equal(cfg.model, 'anthropic/claude-sonnet-4-5', 'user model setting wiped');
    assert.equal(cfg.theme, 'dark', 'user theme setting wiped');
    assert.ok(cfg.plugin.includes('./plugins/ieee-paper-writer/plugin.js'), 'plugin entry missing');
  } finally {
    fs.rmSync(xdg, { recursive: true, force: true });
    fs.rmSync(shimDir, { recursive: true, force: true });
  }
});

// ── 4. Uninstall removes opencode artifacts and prunes config ────────────
test('opencode uninstall removes plugin dir, command/agent/skill files, prunes opencode.json', () => {
  const xdg = freshTmpDir();
  const shimDir = shimOpencode();
  try {
    const env = { ...process.env, XDG_CONFIG_HOME: xdg, PATH: pathWith(shimDir), NO_COLOR: '1' };
    const r1 = runInstaller(['--only', 'opencode'], env);
    assert.notEqual(r1.status, 2);

    const r2 = runInstaller(['--uninstall'], env);
    assert.notEqual(r2.status, 2);

    const ocDir = path.join(xdg, 'opencode');
    assert.equal(fs.existsSync(path.join(ocDir, 'plugins', 'ieee-paper-writer')), false, 'plugin dir survived');
    assert.equal(fs.existsSync(path.join(ocDir, 'commands', 'ieee-paper-writer.md')), false, 'ieee-paper-writer.md command survived');
    assert.equal(fs.existsSync(path.join(ocDir, 'agents', 'ieee-paper-author.md')), false, 'ieee-paper-author agent survived');
    assert.equal(fs.existsSync(path.join(ocDir, 'skills', 'ieee-paper-writer')), false, 'ieee-paper-writer skill dir survived');
    assert.equal(fs.existsSync(path.join(ocDir, 'AGENTS.md')), false, 'AGENTS.md (we wrote it) survived');

    if (fs.existsSync(path.join(ocDir, 'opencode.json'))) {
      const cfg = JSON.parse(fs.readFileSync(path.join(ocDir, 'opencode.json'), 'utf8'));
      const stillHasPlugin = Array.isArray(cfg.plugin) && cfg.plugin.includes('./plugins/ieee-paper-writer/plugin.js');
      assert.equal(stillHasPlugin, false, 'plugin entry survived in opencode.json');
    }
  } finally {
    fs.rmSync(xdg, { recursive: true, force: true });
    fs.rmSync(shimDir, { recursive: true, force: true });
  }
});

// ── 5. Plugin smoke: load installed plugin.js, fire the real opencode hooks ──
test('opencode plugin injects pipeline reminder on session init and system transform', async () => {
  const xdg = freshTmpDir();
  const shimDir = shimOpencode();
  try {
    const env = { ...process.env, XDG_CONFIG_HOME: xdg, PATH: pathWith(shimDir), NO_COLOR: '1' };
    const r = runInstaller(['--only', 'opencode'], env);
    assert.notEqual(r.status, 2);

    const pluginPath = path.join(xdg, 'opencode', 'plugins', 'ieee-paper-writer', 'plugin.js');
    process.env.XDG_CONFIG_HOME = xdg;

    const mod = await import(pathToFileURL(pluginPath).href);
    const factory = mod.default || mod.IeeePaperWriterPlugin;
    const handlers = await factory({});

    assert.equal(typeof handlers.event, 'function', 'event dispatcher should be a function');
    assert.equal(typeof handlers['chat.message'], 'function', 'chat.message should be a function');
    assert.equal(typeof handlers['experimental.chat.system.transform'], 'function',
      'system.transform should be a function');

    // system.transform injects the pipeline reminder.
    const sys1 = { system: [] };
    await handlers['experimental.chat.system.transform']({}, sys1);
    assert.ok(sys1.system.length >= 1, 'expected at least one system line');
    assert.match(sys1.system[sys1.system.length - 1], /IEEE-PAPER-WRITER ACTIVE/);

    // event dispatcher for session.created should not throw.
    await assert.doesNotReject(handlers.event({ event: { type: 'session.created' } }));
    await assert.doesNotReject(handlers.event({ event: { type: 'session.idle' } }));
  } finally {
    fs.rmSync(xdg, { recursive: true, force: true });
    fs.rmSync(shimDir, { recursive: true, force: true });
  }
});
