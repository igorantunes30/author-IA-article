# ieee-paper-writer

Write and review scientific manuscripts in IEEE style. Four-agent pipeline. Peer-review-quality output.

## What it does

Transforms raw notes, bullet points, or rough drafts into IEEE-compliant manuscripts through four sequential agents:

| Stage | Agent | Task |
|-------|-------|------|
| 1 | **Author** | Writes complete technical draft with correct paragraph structure |
| 2 | **Editorial** | Refines fluency, rhythm, syntactic variety, connectors |
| 3 | **IEEE Style** | Enforces impersonality, voice balance, acronym protocol, forbidden constructions |
| 4 | **Reviewer** | Acts as anonymous peer reviewer — finds ambiguities, unsupported claims, coherence failures |

## Output

```
## Final Text
[clean IEEE-compliant manuscript]

## Style Notes
[items requiring author action — missing citations, journal-specific choices]

## Reviewer Report
### Major Issues
### Minor Issues
### Corrected in This Pass
```

## Supported journals

IEEE Transactions · IEEE Access · Elsevier · Springer · ACM · Nature Portfolio

## Usage

Just describe what you want to write or paste your draft:

```
/ieee-paper Introduction section for a paper on distributed optimization
```

```
/ieee-paper [paste your rough draft here]
```

Or let it activate automatically when you mention IEEE, manuscript, paper draft, or peer review.

## Language

User input: Portuguese or English.
Manuscript output: always English (IEEE requirement).
Style Notes and Reviewer Report: in the user's language.

## What it never changes

Scientific content is invariant across all four stages:
results · hypotheses · definitions · equations · symbols · parameters ·
numerical values · units · references · citations · causal relationships
