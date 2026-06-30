---
name: author
description: >
  Drafts a complete technical manuscript section from raw notes, bullet points,
  or rough text. Stage 1 only — no editorial or style pass.
  Use when the user says "/author <section>", "draft this", "write from these notes".
  Do NOT activate for /author off or author mode toggle — that is handled by author-mode skill.
---

# Author — Stage 1 Direct

Spawn subagent: `ieee-paper-author`

Input: user's raw material (notes, bullets, rough draft, or existing Portuguese text).
Output: complete technical draft in formal academic English. One clear function per paragraph.
Return the full drafted text only — no meta-commentary.
