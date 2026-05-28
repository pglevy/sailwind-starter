---
inclusion: fileMatch
fileMatchPattern: "src/pages/**"
---

# SAIL Type Definitions

When building pages with Sailwind components, use these exact type values for component parameters. These are the actual types from the `@pglevy/sailwind` package. Do not guess or assume values outside these sets.

```typescript
type SAILShape = "SQUARED" | "SEMI_ROUNDED" | "ROUNDED"
type SAILPadding = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
type SAILMarginSize = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
type SAILSize = "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
type SAILSizeExtended = SAILSize | "MEDIUM_PLUS" | "LARGE_PLUS" | "EXTRA_LARGE"
type SAILAlign = "START" | "CENTER" | "END"
type SAILAlignLegacy = "START" | "CENTER" | "END" | "LEFT" | "RIGHT"
type SAILLabelPosition = "ABOVE" | "ADJACENT" | "COLLAPSED" | "JUSTIFIED"
type SAILSemanticColor = "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | "STANDARD"
type { SAILPaletteColor } from './palette-colors.generated'
type SAILColor = SAILSemanticColor | _PaletteColor
type SAILColorInput = SAILColor | (string & {})
type SAILGridHeight = "SHORT" | "SHORT_PLUS" | "MEDIUM" | "MEDIUM_PLUS" | "TALL" | "TALL_PLUS" | "EXTRA_TALL" | "AUTO"
type SAILGridColumnWidth = "AUTO" | "ICON" | "ICON_PLUS" | "NARROW" | "NARROW_PLUS" | "MEDIUM" | "MEDIUM_PLUS" | "WIDE" | "1X" | "2X" | "3X" | "4X" | "5X" | "6X" | "7X" | "8X" | "9X" | "10X"
```

All parameter values must be UPPERCASE. These are the only valid values — if a component prop expects one of these types, use only the values listed here.
