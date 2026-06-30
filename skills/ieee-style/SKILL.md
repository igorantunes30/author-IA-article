---
name: ieee-style
description: >
  Enforces IEEE linguistic conventions on a manuscript section: impersonality,
  voice balance, acronym protocol, terminological consistency, forbidden constructions.
  Stage 3 only. Use when the user says "/ieee-style", "IEEE format", "fix style",
  "enforce IEEE conventions".
---

# IEEE Style — Stage 3 Direct

Spawn subagent: `ieee-paper-style`

Input: any manuscript text.
Output: IEEE-compliant text + `## Style Notes` listing items flagged but not auto-corrected.
Style Notes may be in the user's language.
