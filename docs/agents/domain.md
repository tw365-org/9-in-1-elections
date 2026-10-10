# Domain docs

How engineering skills should consume this repository's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repository root, or
- **`GLOSSARY-MAP.md`** at the repository root if it exists; it points to one `GLOSSARY.md` per context. Read each one relevant to the topic.
- **`docs/adr/`**: read ADRs that touch the area being changed.

If any of these files do not exist, proceed without treating their absence as a blocker. Create them when domain terms or architecture decisions are actually resolved.

## File structure

This is a single-context repository. Use this structure when the project needs domain documentation:

```text
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-short-decision-name.md
│   └── 0002-another-decision.md
└── src/
```

## Use the glossary's vocabulary

When output names a domain concept (in an issue title, refactor proposal, hypothesis, or test name), use the term as defined in `GLOSSARY.md`. Do not drift to synonyms the glossary explicitly avoids.

If the concept does not yet appear in the glossary, reconsider whether new language is needed or note the gap for domain modeling.

## Flag ADR conflicts

If output contradicts an existing ADR, surface the conflict explicitly rather than silently overriding it.
