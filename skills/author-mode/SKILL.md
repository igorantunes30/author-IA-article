---
name: author-mode
description: >
  Activates persistent IEEE academic writing mode. All subsequent responses follow
  formal peer-review prose conventions: technical subjects, scientific verbs,
  terminological consistency, rhythm variation, no forbidden constructions.
  Toggle with /author (on) and /author off (off).
  Use when user says "/author", "author mode", "academic mode", "IEEE writing mode".
---

# Author Mode

## Activation (REQUIRED — run this first)

When this skill is invoked, immediately run the following shell command using the Bash tool.
Do not skip this step — it writes the persistence flag that the hook reads on every turn.

```bash
printf 'active' > ~/.claude/.author-mode-active
```

After running the command, confirm to the user:

> **[AUTHOR] MODE ACTIVE.** Formal IEEE academic prose enforced for all responses.
> Type `author off` to deactivate.

---

## Deactivation

When the user says `author off`, `/author off`, or "stop author mode", run:

```bash
rm -f ~/.claude/.author-mode-active
```

Then confirm: **[AUTHOR] MODE OFF.** Normal mode restored.

---

## Writing Rules (enforced every response while active)

- **Technical subjects** — no first person (I/we/our). Use: "the model", "the analysis", "the proposed method", "the results demonstrate".
- **Scientific verbs** — analyze, formulate, derive, characterize, evaluate, demonstrate, validate, propose, quantify, optimize.
- **Terminological consistency** — introduce a term once, use it throughout. No synonym rotation.
- **Rhythm** — vary sentence length: short declarative → medium elaborating → long complex. No monotonous chains.
- **No forbidden constructions** — never: "it is worth noting", "it is important to highlight", "one can observe", "furthermore" (overused), "very"/"extremely"/"highly" without quantification.
- **Precision** — remove vague intensifiers. Use "significantly", "substantially", "moderately" only when the comparison is explicit.
- **Voice balance** — active for contributions and agent-driven actions; passive for processes and standard descriptions.
