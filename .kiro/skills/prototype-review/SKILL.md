---
name: prototype-review
description: >
  Run an automated check of a Sailwind Starter prototype against the project's four
  non-negotiable rules (import from @pglevy/sailwind, UPPERCASE SAIL prop values, Lucide icons
  not emoji, data in src/db/) plus routing and data-layer conventions. Use this skill before
  declaring a page or prototype "done", when the user asks to "review my page", "check this
  against the conventions", "did I miss anything", or as a final pass after building or editing
  pages in src/pages/. Complements pnpm run build (which catches type errors) by catching
  convention violations that still compile fine — like lowercase prop values or inlined data.
metadata:
  title: Prototype Review
  prompt: "Review my prototype for convention issues"
  human-reviewer: Philip Levy
---

# Prototype Review

`pnpm run build` catches TypeScript errors, but it happily compiles a page that uses lowercase prop values, imports a raw HTML `<button>` instead of `ButtonWidget`, sprinkles in an emoji, or hardcodes an array of objects instead of pulling from `src/db/`. Those are exactly the four non-negotiable rules from AGENTS.md — and they're the kind of thing that's easy to lose track of once a page grows past its first draft. This skill runs a script that scans for all four, plus a couple of related checks (routing completeness, data-layer shape), and reports findings by severity so you know what actually needs fixing versus what's just worth a glance.

## When to use this

Run it as part of the "Before Declaring Page Complete" checklist in AGENTS.md — after building a page (or several), before telling the user it's done. It's also useful mid-build if something feels off and you want a second pass.

## Steps

### 1. Run the review

Against everything in `src/pages/`:

```bash
node scripts/prototype-review.js
```

Or scoped to specific file(s) you just touched:

```bash
node scripts/prototype-review.js src/pages/task-dashboard.tsx
```

### 2. Read the findings by severity

- 🔴 **Fix before calling this done** — clear rule violations: non-Sailwind imports, lowercase SAIL enum prop values. Fix these.
- 🟡 **Worth checking** — raw HTML elements that might have a Sailwind equivalent, emoji, array literals that look like inline data. Often real, but use judgment — some raw HTML or literal arrays are legitimately fine (e.g. a small `tabs`/`steps` config array in a page is a normal pattern, not a data-layer violation).
- 🟢 **Good to know** — softer signals, like a page using `useState` without importing anything from `src/db/`. Worth a glance, rarely worth blocking on.

The script also flags pages that exist in `src/pages/` but aren't registered in `src/App.tsx`, and entity modules in `src/db/` whose interface doesn't start with `id: number`.

### 3. Fix what's real, explain what isn't

This is a heuristic scanner, not a compiler — it can flag false positives (for example, `MessageBanner`'s `icon` prop is intentionally lowercase, and the script already accounts for that specific case, but new ones may show up as the component library evolves). When something looks like a false positive, say so and explain why rather than blindly "fixing" working code.

### 4. Re-run after fixes

Once changes are made, run the script again to confirm a clean pass, then run `pnpm run build` as the final gate.

## Relationship to other checks

- `pnpm run check:colors` (or the "Check Color Palette" hook) covers Tailwind color-token drift — a separate concern from this skill, run it too if styling was touched.
- This skill doesn't replace `pnpm run build` — run both. The build catches type errors; this catches convention violations that still compile.
