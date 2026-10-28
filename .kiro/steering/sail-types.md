---
inclusion: fileMatch
fileMatchPattern: "src/pages/**"
---

# SAIL Type Definitions

When building pages with Sailwind components, use these exact type values for component parameters. These are the actual types from the `@pglevy/sailwind` package. Do not guess or assume values outside these sets.

```typescript
type SAILShape = "SQUARED" | "SEMI_ROUNDED" | "ROUNDED" | "CIRCLE"
type SAILPadding = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
type SAILMarginSize = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
type SAILSize = "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
type SAILSizeExtended = SAILSize | "MEDIUM_PLUS" | "LARGE_PLUS" | "EXTRA_LARGE"
type SAILAlign = "START" | "CENTER" | "END"
type SAILAlignLegacy = "START" | "CENTER" | "END" | "LEFT" | "RIGHT"
type SAILLabelPosition = "ABOVE" | "ADJACENT" | "COLLAPSED" | "JUSTIFIED"
type SAILSemanticColor = "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | "STANDARD"
type SAILColor = SAILSemanticColor | SAILPaletteColor
type SAILColorInput = SAILColor | (string & {})
type SAILAny = any
type SAILGridHeight = "SHORT" | "SHORT_PLUS" | "MEDIUM" | "MEDIUM_PLUS" | "TALL" | "TALL_PLUS" | "EXTRA_TALL" | "AUTO"
type SAILGridColumnWidth = "AUTO" | "ICON" | "ICON_PLUS" | "NARROW" | "NARROW_PLUS" | "MEDIUM" | "MEDIUM_PLUS" | "WIDE" | "1X" | "2X" | "3X" | "4X" | "5X" | "6X" | "7X" | "8X" | "9X" | "10X"
// SAILPaletteColor is FAMILY_STEP, e.g. TEAL_700 or BURNT_ORANGE_50
// FAMILY: RED | BURNT_ORANGE | ORANGE | AMBER | YELLOW | LIME | GREEN | TEAL | CYAN | SKY | BLUE | VIOLET | PURPLE | PINK | GRAY
// STEP: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
type SAILPaletteColor = `${FAMILY}_${STEP}`
interface SAILDynamicLink {
    label?: string;
    value?: SAILAny;
    saveInto?: (value?: SAILAny) => void;
    showWhen?: boolean;
    onClick?: (value?: SAILAny) => void;
}
interface SortInfo {
    field: string;
    ascending: boolean;
}
```

All parameter values must be UPPERCASE. These are the only valid values — if a component prop expects one of these types, use only the values listed here.
