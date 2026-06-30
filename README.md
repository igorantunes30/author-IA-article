<p align="center">
  <img src="11.png" width="90" />
  <img src="12.png" width="90" />
  <img src="13.png" width="90" />
  <img src="14.png" width="90" />
</p>

<h1 align="center">ieee-paper-writer</h1>

<p align="center">
  <strong>Raw notes in. Peer-review-ready manuscript out.</strong>
</p>

<p align="center">
  <a href="https://github.com/igorantunes30/author-IA-article/stargazers"><img src="https://img.shields.io/github/stars/igorantunes30/author-IA-article?style=flat&color=blue" alt="Stars"></a>
  <a href="https://github.com/igorantunes30/author-IA-article/commits/main"><img src="https://img.shields.io/github/last-commit/igorantunes30/author-IA-article?style=flat" alt="Last commit"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/igorantunes30/author-IA-article?style=flat" alt="License"></a>
</p>

<p align="center">
  <a href="#before--after">Before/After</a> •
  <a href="#installation">Installation</a> •
  <a href="#pipeline">Pipeline</a> •
  <a href="#what-you-get">What you get</a> •
  <a href="./INSTALL.md">Full install guide</a>
</p>

---

A skill/plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (also Cursor, Windsurf, Cline, Copilot, and 30+ agents) that transforms drafts, bullet points, or raw notes into **peer-review-ready academic manuscripts**, following IEEE, Elsevier, Springer, ACM, Nature Portfolio, and Qualis A standards. Four specialized agents. One command.

## Before / After

<table>
<tr>
<td width="50%">

### Raw input

> "we propose a distributed algorithm to optimize sensor networks. reduces energy consumption. tested on 3 topologies. good results. better than baseline."

</td>
<td width="50%">

### ieee-paper-writer output

> "This paper proposes a distributed optimization algorithm for energy-constrained sensor networks. The proposed approach reduces energy consumption by exploiting local topology information to minimize inter-node communication overhead. Experimental evaluation across three representative network topologies demonstrates a statistically significant improvement over the baseline, with a mean energy reduction of X% (p < 0.05)."

</td>
</tr>
<tr>
<td>

### Raw input

> "the method works because nodes only talk to neighbors. avoids global coordination. we show convergence."

</td>
<td>

### ieee-paper-writer output

> "The convergence of the proposed method is guaranteed under mild connectivity assumptions. By restricting information exchange to immediate neighbors, the algorithm eliminates the need for global coordination, thereby reducing communication complexity from O(n²) to O(d), where d denotes the maximum node degree."

</td>
</tr>
</table>

**Same ideas. Publication-grade language. Every time.**

## Pipeline

Four agents in sequence. Each stage builds on the previous.

```
Input (notes / draft / section)
        │
        ▼
┌───────────────────┐
│  Stage 1: Author  │  Senior researcher persona. Writes complete technical
│                   │  draft: structure, argumentation, scientific verbs,
│                   │  paragraph logic. Full paper lifecycle supported.
└────────┬──────────┘
         │
         ▼
┌────────────────────────┐
│  Stage 2: Editorial    │  Linguistics specialist. Refines fluency, rhythm,
│                        │  syntactic variety, transitions, connectors.
│                        │  Does NOT touch scientific content.
└────────┬───────────────┘
         │
         ▼
┌─────────────────────────┐
│  Stage 3: IEEE Style    │  Applies IEEE conventions: impersonality,
│                         │  voice balance, acronym protocol,
│                         │  forbidden constructions, precision vocabulary.
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Stage 4: Reviewer       │  Anonymous peer reviewer. Finds ambiguities,
│                          │  unsupported claims, coherence failures,
│                          │  structural issues. Flags what needs action.
└────────┬─────────────────┘
         │
         ▼
Final manuscript + Style Notes + Reviewer Report
```

**Scientific content is invariant across all four stages.** Results, hypotheses, equations, numerical values, citations — never altered.

## What each stage does

Each stage has a distinct responsibility that does not overlap with the previous.

<img src="11.png" width="64" />

### Stage 1 — Author

Transforms raw material (notes, bullet points, drafts, Portuguese text) into complete technical prose. The Author agent decides paragraph structure, selects precise scientific verbs, and assigns a clear function to each paragraph — contextualization, formulation, analysis, interpretation, partial conclusion. It does not polish existing text; it writes from raw input. The full paper lifecycle is supported: problem definition → literature → gap → motivation → proposal → mathematical model → evaluation → conclusions.

<img src="12.png" width="64" />

### Stage 2 — Editorial

Receives the Author draft and improves only linguistic form — never scientific content. The Editorial agent works on sentence rhythm (alternating short declarative → medium elaborating → long complex), removes connectors placed by habit rather than logic (repeated "furthermore", "moreover"), eliminates redundant sentences that restate the previous without adding information, and corrects parallelism violations in lists and enumerations. It has no awareness of IEEE conventions — its sole concern is high-quality academic prose.

<img src="13.png" width="64" />

### Stage 3 — IEEE Style

Receives the Editorial text and applies the specific conventions of IEEE Transactions and IEEE Access. Responsibilities: replace first-person constructions ("we propose" → "this paper proposes"), apply the acronym protocol (full term on first occurrence, acronym thereafter), build a canonical term map and eliminate synonym rotation, remove forbidden constructions ("it is worth noting that", "very", "extremely" without quantification), and balance active and passive voice per IEEE convention. Delivers the manuscript plus a `## Style Notes` block listing items that require author action.

<img src="14.png" width="64" />

### Stage 4 — Reviewer

Acts as an anonymous peer reviewer. The Reviewer agent does not rewrite — it diagnoses. Identifies: claims without citation or quantitative support, contradictions between stated hypotheses and presented results, missing experimental details required for reproducibility, scope statements that exceed what the paper delivers, logical gaps between consecutive arguments, and structural failures (non-self-contained abstract, conclusion introducing new material). What can be corrected directly (redundant sentences, ambiguous pronoun references, parallelism violations) is fixed inline. Everything else appears in a structured `## Reviewer Report` with section and paragraph location, stating exactly what the author must provide to resolve each issue.

---

**Practical analogy:**

| Stage | Role |
|---|---|
| Author | Senior researcher writing the complete first draft |
| Editorial | Copy editor refining linguistic quality |
| IEEE Style | Copydesk formatting for the specific journal |
| Reviewer | Anonymous referee deciding acceptance or revision |

## Individual skills

In addition to the full pipeline, each stage is available as an independent command:

| Command | Runs |
|---|---|
| `/ieee-paper-writer` | Full pipeline: Author → Editorial → Style → Reviewer |
| `/author <text>` | Stage 1 only — draft from raw notes |
| `/editorial <text>` | Stage 2 only — fluency and rhythm |
| `/ieee-style <text>` | Stage 3 only — IEEE convention enforcement |
| `/reviewer <text>` | Stage 4 only — anonymous peer review |
| `/author-mode` | Activates persistent academic writing mode for all responses |

## Installation

One line. Detects all agents on your machine. Installs for each one.

```bash
# macOS / Linux / WSL / Git Bash
curl -fsSL https://raw.githubusercontent.com/igorantunes30/author-IA-article/main/install.sh | bash

# Windows (PowerShell 5.1+)
irm https://raw.githubusercontent.com/igorantunes30/author-IA-article/main/install.ps1 | iex
```

~30 seconds. Requires Node ≥18. Safe to re-run.

**Activation:** paste a draft, say "write the introduction", or type `/ieee-paper-writer`. The pipeline runs automatically when you mention manuscript, IEEE paper, peer review, or academic writing.

Single agent, or 30+ others → [**INSTALL.md**](./INSTALL.md).

## What you get

| Skill / Agent | Function |
|---|---|
| `/ieee-paper-writer` | Runs the complete four-stage pipeline on any input. |
| `ieee-paper-author` | Stage 1 — drafts complete technical sections from notes or outlines. |
| `ieee-paper-editorial` | Stage 2 — refines fluency and paragraph structure without touching content. |
| `ieee-paper-style` | Stage 3 — applies IEEE linguistic conventions. |
| `ieee-paper-reviewer` | Stage 4 — anonymous peer review. Diagnoses scientific and logical issues. |

### Supported journals

| Target | Style applied |
|--------|---------------|
| IEEE Transactions / IEEE Access | Full IEEE conventions (impersonality, acronym protocol, passive/active balance) |
| Elsevier / Springer | Formal academic English, section structure, citation style |
| ACM | Technical precision, reproducibility language |
| Nature Portfolio | Concise scientific prose, broad accessibility |
| Qualis A (CAPES) | Brazilian high-impact journal standards |

### Output format

Each run produces three blocks:

```
## Final Text
[clean, IEEE-compliant manuscript section]

## Style Notes
[items requiring author action — missing citations, journal-specific choices,
 X-marked values that need real numbers]

## Reviewer Report
### Major Issues
### Minor Issues
### Corrected in This Pass
```

### Language

- **Input:** Portuguese or English.
- **Manuscript output:** always in English (IEEE requirement).
- **Style Notes and Reviewer Report:** in the user's input language.

## Usage examples

```
/ieee-paper-writer Introduction section for a paper on distributed optimization in sensor networks
```

```
/ieee-paper-writer [paste your raw draft or bullet list here]
```

```
/ieee-paper-writer Rewrite my methodology section in a more formal style
```

```
/ieee-paper-writer Peer review this abstract: [text]
```

## Supported sections

Abstract · Introduction · Related Work · Background · Methodology · Proposed Approach ·
Mathematical Formulation · Architecture · Algorithm · Experimental Setup · Results ·
Discussion · Conclusion · Future Work · Acknowledgments

## How it works

1. Provide raw material — bullet points, rough prose, or a complete draft.
2. The **Author** agent structures the content and writes a complete technical draft.
3. The **Editorial** agent refines language, rhythm, and paragraph logic.
4. The **IEEE Style** agent applies journal-specific conventions.
5. The **Reviewer** agent diagnoses remaining issues as an anonymous peer reviewer.
6. The final manuscript, style notes, and reviewer report are returned.

Formal academic English is maintained throughout manuscript generation.

## Links

- [INSTALL.md](./INSTALL.md) — full installation matrix, all flags, per-agent details
- [CONTRIBUTING.md](./CONTRIBUTING.md) — how to submit a contribution
- [CLAUDE.md](./CLAUDE.md) — maintainer guide
- [Issues](https://github.com/igorantunes30/author-IA-article/issues) — bug, feature, or unexpected behavior

## License

MIT.
