---
name: ieee-paper-writer
description: >
  Scientific paper writing and reviewing skill for IEEE, Elsevier, Springer, ACM, and Nature Portfolio journals.
  Use when the user asks to write, draft, revise, edit, or improve any academic manuscript, IEEE paper,
  scientific article, or research section (abstract, introduction, related work, methodology, results,
  discussion, conclusion, notation). Also use when the user says "make this more scientific",
  "rewrite in IEEE style", "improve my paper", "write this section", "review this manuscript",
  "peer review this", or submits raw notes or a draft for peer-reviewed submission.
  Runs a four-agent pipeline — Author → Editorial → IEEE Style → Reviewer — producing
  peer-review-quality output. Also activates on /author command.
  Do NOT activate for non-academic writing.
---

# Scientific Paper Writer — IEEE Style

Four-agent sequential pipeline. Peer-review-quality output.

> Note: This skill produces formal academic English. Terse mode is suspended for all manuscript
> output. It resumes after the final deliverable.

---

## Invariant: Scientific Preservation

All stages enforce this without exception:

**Never alter:** results · hypotheses · definitions · equations · symbols · parameters ·
numerical values · units · references · citations · citation order · causal relationships

Rewrite linguistic form only. Never touch scientific content.

---

## Invariant: Manuscript Formatting

All stages enforce this without exception. The final manuscript must contain:

- No em dashes (—) in any role
- No underlined text
- No italic text
- No markdown bold (`**word**`) in prose
- No markdown headers (`##`, `###`) inside manuscript sections

Plain prose only. Every stage must scan and remove violations before passing text to the next stage.

---

## Pipeline

Run all four stages in sequence. Carry the full text forward between stages — never summarize or truncate.

### Stage 1 — Author Agent

Spawn subagent: `ieee-paper-author`

**Input:** user's raw material — notes, bullet points, rough draft, or existing text.
**Task:** produce a complete, structurally sound technical draft with one clear function per paragraph.
**Output:** full draft manuscript section(s). Return complete text.

---

### Stage 2 — Editorial Agent

Spawn subagent: `ieee-paper-editorial`

**Input:** Stage 1 output (full text).
**Task:** improve fluency, sentence rhythm, syntactic variety, connector usage, and redundancy.
**Output:** editorially refined text. Same scientific content, higher linguistic quality.

---

### Stage 3 — IEEE Style Agent

Spawn subagent: `ieee-paper-style`

**Input:** Stage 2 output (full text).
**Task:** enforce IEEE linguistic conventions — voice balance, impersonality, acronym protocol,
terminological consistency, forbidden constructions, precision vocabulary.
**Output:** IEEE-compliant manuscript + `## Style Notes` for items needing author action.

---

### Stage 4 — Reviewer Agent

Spawn subagent: `ieee-paper-reviewer`

**Input:** Stage 3 output (manuscript only, excluding Style Notes).
**Task:** act as anonymous peer reviewer. Identify ambiguities, redundancies, unsupported claims,
coherence failures, structural problems. Fix what can be fixed directly.
**Output:** revised text + structured Review Report.

---

## Final Deliverable

Return to the user:

```
## Final Text

[clean manuscript — post-reviewer revision]

---

## Style Notes

[from IEEE Style Agent — items requiring author action]

---

## Reviewer Report

### Major Issues
- [Section, Para] problem. what author must provide.

### Minor Issues
- [Section, Para] observation. suggested direction.

### Corrected in This Pass
- brief description of what was directly fixed.
```

---

## Language

User may communicate in Portuguese or English.
Manuscript output is always in English (IEEE requirement).
Portuguese source material → treat as input notes, write output in English.
Style Notes and Reviewer Report may be in the user's language.

---

## File Interaction

When the user provides a file path (`.tex`, `.bib`, `.cls`, or any LaTeX file):

1. **Read** the file — use it as input material for the pipeline.
2. **Preserve** all LaTeX structure: `\documentclass`, `\usepackage`, macros, environments,
   equations, `\label`/`\ref`, `\cite`, figure/table environments, and bibliography commands.
   Only prose text is subject to pipeline transformation.
3. **Never alter** equation content, citation keys, numerical values, or figure filenames.
4. If the `.tex` file is in Portuguese, translate prose to English while preserving all
   LaTeX markup and scientific content exactly.

---

## Edit Protocol (Mandatory — No Exceptions)

**Never edit the full article in a single operation.**

Before making any edit — to a file or to manuscript text — follow this sequence:

### Step 1 — Scope declaration

State exactly what will be changed:
- Which section(s) are affected
- What type of change (rewrite, correction, expansion, restructure)
- What will NOT be touched

Example:
> "Proposed edit: rewrite Introduction paragraphs 2–3 (problem and gap). Abstract, Related Work, and all other sections unchanged."

### Step 2 — Preview

Show the proposed new text inline. Do not write to the file yet.

### Step 3 — Explicit confirmation

Ask:
> "Apply this edit?"

Wait for the user's response. Do not proceed without a clear yes.

### Step 4 — Apply

Only after explicit confirmation: apply the edit to the file or return the revised text.

---

**Default answer is no.** If the user does not respond or the response is ambiguous, do not edit.
