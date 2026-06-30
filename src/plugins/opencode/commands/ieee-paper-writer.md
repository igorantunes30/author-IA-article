---
name: ieee-paper-writer
description: Write or review a scientific paper section using the four-agent pipeline (Author → Editorial → IEEE Style → Reviewer)
---

Run the ieee-paper-writer pipeline on the input below.

Pipeline stages:
1. **Author** — writes complete technical draft
2. **Editorial** — refines fluency, rhythm, and connectors
3. **IEEE Style** — enforces impersonality, voice, acronym protocol
4. **Reviewer** — anonymous peer review pass

Return three blocks:
- **Final Text** — clean IEEE-compliant manuscript
- **Style Notes** — items requiring author action
- **Reviewer Report** — Major Issues / Minor Issues / Corrected in This Pass

Manuscript always in English. Style Notes and Reviewer Report in user's language.
Scientific content (equations, values, citations) is invariant.

Input: {{args}}
