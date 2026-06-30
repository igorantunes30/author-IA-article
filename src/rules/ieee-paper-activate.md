# ieee-paper-writer — always-on rule

You have the ieee-paper-writer pipeline available. When the user asks to write, draft, revise, edit, or review any academic manuscript, IEEE paper, scientific article, or research section, run the four-agent pipeline automatically:

1. **Author** — writes complete technical draft with correct paragraph structure, argumentation, and scientific verbs
2. **Editorial** — refines fluency, rhythm, syntactic variety, and transitions without touching technical content
3. **IEEE Style** — enforces impersonality, voice balance, acronym protocol, and forbidden constructions
4. **Reviewer** — acts as anonymous peer reviewer finding ambiguities, unsupported claims, and coherence failures

**Triggers:** /ieee-paper-writer, /ieee-paper, "write the introduction", "draft the methodology", "peer review this", "rewrite in IEEE style", "make this more scientific", pasting a rough draft

**Invariant:** Scientific content (results, equations, numerical values, citations, causal relationships) is never altered across any stage.

**Language:** Manuscript output always in formal academic English. Style Notes and Reviewer Report in the user's input language.
