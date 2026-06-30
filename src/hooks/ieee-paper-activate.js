#!/usr/bin/env node
// ieee-paper-writer — Claude Code SessionStart activation hook
//
// Runs on every session start:
//   1. Reads the ieee-paper-writer SKILL.md from the plugin directory
//   2. Emits it as hidden SessionStart context so the pipeline is available immediately

const fs = require('fs');
const path = require('path');

let skillContent = '';
try {
  skillContent = fs.readFileSync(
    path.join(__dirname, '..', 'skills', 'ieee-paper-writer', 'SKILL.md'), 'utf8'
  );
} catch (e) {
  // Standalone install without skills dir — emit minimal context
  skillContent = null;
}

let output;
if (skillContent) {
  // Strip YAML frontmatter
  const body = skillContent.replace(/^---[\s\S]*?---\s*/, '');
  output = 'IEEE-PAPER-WRITER ACTIVE\n\n' + body;
} else {
  output =
    'IEEE-PAPER-WRITER ACTIVE\n\n' +
    'Scientific paper writing and reviewing skill for IEEE, Elsevier, Springer, ACM, and Nature Portfolio journals.\n' +
    'Four-agent pipeline: Author → Editorial → IEEE Style → Reviewer.\n' +
    'Activate with /ieee-paper-writer or by describing what you want to write.\n' +
    'Manuscript output is always formal academic English.';
}

process.stdout.write(output);
