---
name: reviewer
description: >
  Anonymous peer reviewer for a manuscript section or full paper.
  Skips Author/Editorial/Style stages — runs Stage 4 only.
  Use when the user says "/reviewer", "review this", "peer review",
  "review my section", or pastes text for review feedback.
---

# Reviewer — Stage 4 Direct

Spawn subagent: `ieee-paper-reviewer`

Pass the user's text directly as input.

Return both blocks:
1. **Revised Text** — with directly correctable issues already fixed.
2. **Review Report** — Major Issues / Minor Issues / Corrected in This Pass.

Review Report may be in the user's language. Revised text is always in English.
