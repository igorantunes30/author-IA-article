#!/usr/bin/env node
// ieee-paper-writer — UserPromptSubmit hook
// Detects /ieee-paper-writer pipeline triggers AND /author mode commands.
// Injects per-turn context for whichever mode is active.

const fs = require('fs');
const path = require('path');
const os = require('os');

// ── Flag file for /author mode persistence ─────────────────────────────────
const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const AUTHOR_FLAG = path.join(claudeDir, '.author-mode-active');

function writeAuthorFlag() {
  try {
    // Refuse if the flag path is already a symlink (security: prevent clobber)
    try { if (fs.lstatSync(AUTHOR_FLAG).isSymbolicLink()) return; } catch (e) {}
    const tmp = AUTHOR_FLAG + '.' + process.pid + '.' + Date.now();
    fs.writeFileSync(tmp, 'active', { mode: 0o600 });
    fs.renameSync(tmp, AUTHOR_FLAG);
  } catch (e) {}
}

function deleteAuthorFlag() {
  try { fs.unlinkSync(AUTHOR_FLAG); } catch (e) {}
}

function readAuthorFlag() {
  try {
    const st = fs.lstatSync(AUTHOR_FLAG);
    if (st.isSymbolicLink() || !st.isFile()) return false;
    return st.size < 32;
  } catch (e) { return false; }
}

// ── Pipeline triggers ──────────────────────────────────────────────────────
const PAPER_TRIGGERS = [
  /\/ieee-paper-writer/i,
  /\/ieee-paper/i,
  /\bwrite\b.*\b(paper|article|manuscript|abstract|introduction|conclusion|methodology|related work)\b/i,
  /\b(paper|manuscript|article)\b.*\b(write|draft|revise|edit|improve|review)\b/i,
  /\bpeer.?review\b/i,
  /\bIEEE\b.*\b(paper|style|format|submission)\b/i,
  /\b(academic|scientific)\b.*\b(writing|paper|article)\b/i,
  /\brewrite\b.*\b(IEEE|scientific|academic)\b.*\bstyle\b/i,
  /\b(more scientific|peer.?review.?quality)\b/i,
];

// ── Author mode triggers ───────────────────────────────────────────────────
// Forms Claude Code may send to hooks:
//   /author                         typed shorthand
//   /author-mode                    skill name
//   /author-mode:author-mode        some autocomplete expansions
//   /ieee-paper-writer:author-mode  fully-qualified plugin:skill name
//   author on / author off          plain text, never intercepted by CC
const AUTHOR_ON = new RegExp(
  '^(?:' +
    '\\/ieee-paper-writer:author(?:-mode)?' +    // fully-qualified
  '|' +
    '\\/author(?:-mode)?(?::author-mode)?' +     // shorthand variants
      '(?:\\s+(?:on|start|activate|enable))?' +
  '|' +
    'author\\s+on' +                             // plain text
  ')$', 'i'
);
const AUTHOR_OFF = new RegExp(
  '^(?:' +
    '\\/ieee-paper-writer:author(?:-mode)?\\s+(?:off|stop|disable|deactivate)' +
  '|' +
    '\\/author(?:-mode)?(?::author-mode)?\\s+(?:off|stop|disable|deactivate)' +
  '|' +
    'author\\s+off' +
  ')$', 'i'
);

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = (data.prompt || '').trim();
    const promptLower = prompt.toLowerCase();

    // ── /author mode toggle ──────────────────────────────────────────────
    if (AUTHOR_OFF.test(promptLower)) {
      deleteAuthorFlag();
      // Let Claude confirm deactivation — no hookSpecificOutput needed
      return;
    }

    if (AUTHOR_ON.test(promptLower)) {
      writeAuthorFlag();
      // Skill SKILL.md content is shown by Claude via the Skill tool;
      // inject a reinforcement so the model knows the mode is now persisted.
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext:
            '[AUTHOR] MODE ACTIVE. Respond in formal IEEE academic prose. ' +
            'Technical subjects only (no I/we/our). ' +
            'Scientific verbs: analyze/formulate/derive/characterize/evaluate/demonstrate/validate/propose/quantify/optimize. ' +
            'Terminological consistency — no synonym rotation. ' +
            'Vary sentence rhythm. ' +
            'No forbidden constructions (it is worth noting / furthermore overused / very·extremely·highly without quantification). ' +
            'Mode persists until /author off.'
        }
      }));
      return;
    }

    // ── Per-turn [AUTHOR] reinforcement ──────────────────────────────────
    if (readAuthorFlag()) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext:
            '[AUTHOR] MODE ACTIVE — overrides all other style modes including caveman/terse. ' +
            'Write in complete formal sentences. Formal IEEE academic prose only. ' +
            'Technical subjects (no I/we/our). Scientific verbs. ' +
            'Terminological consistency. Varied rhythm. ' +
            'No forbidden constructions. No fragments. No terse output.'
        }
      }));
      return;
    }

    // ── ieee-paper-writer pipeline triggers ──────────────────────────────
    const isTrigger = PAPER_TRIGGERS.some(re => re.test(prompt));
    if (isTrigger) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext:
            'IEEE-PAPER-WRITER ACTIVE. Run the four-agent pipeline: ' +
            '(1) Author — complete technical draft; ' +
            '(2) Editorial — fluency and paragraph structure; ' +
            '(3) IEEE Style — impersonality, voice, acronym protocol; ' +
            '(4) Reviewer — anonymous peer review. ' +
            'Manuscript output always in formal academic English. ' +
            'Style Notes and Reviewer Report in the user\'s language. ' +
            'Scientific content (equations, values, citations) is invariant across all stages.'
        }
      }));
    }
  } catch (e) {
    // Silent fail
  }
});
