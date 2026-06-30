// ieee-paper-writer — opencode plugin
//
// Provides ieee-paper-writer pipeline awareness for opencode:
// - Emits the four-agent pipeline rules on session start
// - Detects paper-writing triggers in user prompts per turn
// - Injects pipeline stage reminder into the system prompt when active
//
// Hook mapping (opencode >= 1.15.x):
//   - event (event.type === 'session.created'): session-init context injection
//   - chat.message: intercept user prompts for pipeline triggers
//   - experimental.chat.system.transform: inject pipeline reminder per-turn

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

const PIPELINE_REMINDER =
  'IEEE-PAPER-WRITER ACTIVE. Four-agent pipeline: ' +
  'Author → Editorial → IEEE Style → Reviewer. ' +
  'Manuscript output always in formal academic English.';

// Regexes that indicate the user is working on a paper.
const PAPER_TRIGGERS = [
  /\/ieee-paper(-writer)?/i,
  /\bwrite\s+(the\s+)?(introduction|abstract|methodology|conclusion|related work|results|discussion)\b/i,
  /\b(draft|compose|structure)\s+(the\s+)?(paper|manuscript|article|section)\b/i,
  /\bpeer[ -]review\s+this\b/i,
  /\b(rewrite|format|style)\s+(in\s+)?ieee\b/i,
  /\bmake\s+this\s+(more\s+)?(scientific|academic|formal)\b/i,
];

function skillPath() {
  // Installed layout: plugin dir sits inside plugin install dir.
  // Dev layout: src/plugins/opencode/ → three levels up is repo root.
  const candidates = [
    join(here, 'skills', 'ieee-paper-writer', 'SKILL.md'),
    join(here, '..', '..', '..', 'skills', 'ieee-paper-writer', 'SKILL.md'),
  ];
  for (const p of candidates) {
    const resolved = resolve(p);
    if (existsSync(resolved)) return resolved;
  }
  return null;
}

function loadSkillContext() {
  const p = skillPath();
  if (!p) return PIPELINE_REMINDER;
  try {
    const raw = readFileSync(p, 'utf8');
    // Strip YAML frontmatter if present.
    return raw.replace(/^---[\s\S]*?---\n/, '').trim();
  } catch {
    return PIPELINE_REMINDER;
  }
}

function hasPaperTrigger(prompt) {
  if (!prompt) return false;
  return PAPER_TRIGGERS.some(rx => rx.test(prompt));
}

export const IeeePaperWriterPlugin = async (_ctx) => {
  const skillContext = loadSkillContext();

  return {
    // Fires on every new session — inject the pipeline rules as system context.
    event: async ({ event } = {}) => {
      if (event && event.type === 'session.created') {
        return { system: skillContext };
      }
    },

    // Detect paper-writing triggers in user messages.
    'chat.message': async (_input, output) => {
      if (!output || !output.parts) return;
      for (const part of output.parts) {
        if (part && part.type === 'text' && hasPaperTrigger(part.text)) {
          // State tracked externally via flag (set by ieee-paper-activate.js).
          break;
        }
      }
    },

    // Inject the pipeline reminder into system prompt every turn when active.
    'experimental.chat.system.transform': async (_input, output) => {
      if (!output || !Array.isArray(output.system)) return;
      output.system.push(PIPELINE_REMINDER);
    },
  };
};

export default IeeePaperWriterPlugin;
