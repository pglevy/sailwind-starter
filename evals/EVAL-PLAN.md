# Sailwind Prototype Generation — Eval Plan

## Goal

Measure how changes to the Sailwind component library and starter template affect the quality, correctness, and consistency of AI-generated prototypes.

## Scenarios (Active)

| ID | Scenario | Input | What it tests |
|----|----------|-------|---------------|
| S2 | App spec | Structured spec/PRD (feature list, data model, user flows) | Spec-following fidelity |
| S7 | Inspo image only | Screenshot of a SAIL inspo example | Visual-to-code from screenshot alone |
| S8 | Inspo SAIL only | The SAIL expression source code | SAIL → Sailwind translation accuracy |
| S9 | Inspo image + SAIL | Both screenshot and expression | Best-case input — does having both improve output? |

### Future scenarios (not yet active)

| ID | Scenario | Input |
|----|----------|-------|
| S1 | Basic prompt | Natural language description |
| S3 | Image mockup (non-inspo) | Wireframe or Figma export |
| S4 | Existing code | TSX to refactor/extend |
| S5 | Spec + image | Spec paired with reference screenshot |
| S6 | Prompt + existing code | Iteration on existing TSX |

## Inspo Example Corpus (S7, S8, S9)

Each inspo example is stored as a self-contained directory:

```
evals/inspo/<example-name>/
├── screenshot.png              # Full-page screenshot of the inspo
├── source.sail                 # SAIL expression (if available)
├── expected-structure.json     # Component checklist for automated scoring
├── assets/                     # Images used IN the mockup (avatars, backgrounds, etc.)
│   ├── avatar.jpg
│   └── header-bg.png
└── prompt-variants/
    ├── image-only.md           # S7: "Reproduce this interface" + screenshot
    ├── sail-only.md            # S8: "Convert this SAIL to Sailwind" + expression
    └── combined.md             # S9: Both image and expression
```

### Asset handling

Inspo examples often contain images (avatars, backgrounds, icons). These are provided to the agent as part of the eval input and copied to `public/` before generation. This ensures visual comparison is apples-to-apples — layout and component differences aren't masked by missing images.

### Coverage mix

Aim for a range across the 8+ examples:
- **SAIL-heavy:** Lots of expression code, straightforward layout → tests translation accuracy
- **Image-heavy:** Rich visual design, minimal SAIL → tests visual comprehension
- **Balanced:** Both strong SAIL and strong visual → tests combined workflow

## App Spec Corpus (S2)

```
evals/app-spec/<spec-name>/
├── spec.md                     # The app spec / PRD
├── expected-structure.json     # Component and page checklist
└── assets/                     # Any reference images mentioned in spec
```

## Iteration Protocol

### One-shot (primary)

Agent gets the prompt, generates the page, done. Measures baseline generation quality. Run on all eval prompts.

### Iterative (secondary, N=3 max turns)

Run on a complex subset (2–3 examples). Protocol:

1. Agent generates page
2. Automated checks run (build, lint, color palette, console errors)
3. Failures fed back as the next turn
4. Repeat up to N times
5. Score the **final output** AND record **turns to pass**

Gives two metrics: final quality and iteration cost.

For iterative runs, the agent uses browser devtools (screenshot, console errors) as the feedback loop — sees the rendered output and self-corrects.

## Scoring

### Automated (every eval run)

| Check | What it measures | How |
|-------|-----------------|-----|
| Build passes | Syntactic/type correctness | `pnpm run build` exit code |
| No console errors | Runtime correctness | Playwright: check console after render |
| Color palette compliance | Design system adherence | `pnpm run check:colors` |
| Sailwind-first ratio | Library adoption | Count `@pglevy/sailwind` imports vs raw HTML elements |
| Component correctness | Correct API usage | SAIL params uppercase, no anti-patterns |
| Data layer compliance | Convention adherence | Data in `src/db/`, pages use async imports |
| Route + home link | Completeness | Page in App.tsx and home.tsx |
| Structural match | Layout fidelity (inspo only) | Compare component counts/types against expected-structure.json |
| Component mapping | Translation accuracy (S8/S9) | Did SAIL components map to correct Sailwind equivalents? |
| Visual similarity | Pixel-level fidelity (inspo only) | Screenshot diff (SSIM or perceptual hash) against baseline |

### Human eval (subset or milestones)

| Method | What it measures |
|--------|-----------------|
| A/B preference ("this or that") | Perceived quality: Sailwind output vs control (raw Tailwind/HTML) |
| Fidelity rating (1–5) | How closely output matches input spec or inspo image |
| Appian-likeness (1–5) | Does it feel like a real Appian interface? |
| Completeness checklist | Which requested features/sections are present |

### Control groups

For A/B comparison, generate the same prompts using:
- **Control A:** Same model, React + Tailwind, no Sailwind library
- **Control B:** Sailwind library but no starter template (no AGENTS.md, no steering files)
- **Treatment:** Full Sailwind + starter template

Isolates library value vs. agent guidance value.

## When to Run

- **Library version bumps** — does upgrading `@pglevy/sailwind` improve or regress generation?
- **Template changes** — does updating AGENTS.md, steering files, or hooks change outcomes?
- **Model changes** — does a new model version change quality?

## Metrics to Track Over Time

- Pass rates per automated check
- Average human fidelity score
- A/B win rate (Sailwind vs control)
- Iteration count to pass all automated checks
- Sailwind-first ratio trend
- Structural match score per inspo example

## Open Questions

1. Which models to eval? Just primary, or compare across models?
2. How many human evaluators? One for quick iterations, 3+ for milestone significance?
3. Image mockup sources for future S3 — real Appian screenshots, Figma, or wireframes?
