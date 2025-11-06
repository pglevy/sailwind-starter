# Sailwind Component Library - Agent Reference

This document provides essential guidance for AI agents (Amazon Q and Kiro) working with the Sailwind React component library for rapid Appian prototyping.

## Critical Principles

### 1. SAIL-Exact Parameters (UPPERCASE Required)

Always use UPPERCASE for SAIL parameter values:

```tsx
// ✅ CORRECT
<TagField size="STANDARD" labelPosition="COLLAPSED" />

// ❌ WRONG
<TagField size="standard" labelPosition="collapsed" />
```

### 2. Check Components First

**ALWAYS check `src/components/index.ts` before using raw HTML or third-party libraries.**

Available components include:
- Form: `DropdownField`, `TextFieldInput`, `CheckboxField`, `RadioButtonField`, `SliderField`, `SwitchField`
- Display: `ButtonWidget`, `ButtonArrayLayout`, `TagField`, `CardLayout`, `HeadingField`, `RichTextDisplayField`, `ImageField`, `MessageBanner`, `ProgressBar`, `StampField`
- Interactive: `Tabs`, `DialogField`, `ToggleField`

### 3. UserImage is NOT a Component

**CRITICAL:** `UserImage` is a data structure, not a React component.

```tsx
// ❌ WRONG - UserImage is not a component
<UserImage name="John" imageUrl="/avatar.jpg" size="SMALL" />

// ✅ CORRECT - Use ImageField with style="AVATAR"
<ImageField
  images={[{
    imageType: 'user' as const,
    user: {
      name: "John Smith",
      photoUrl: "/avatar.jpg",
      initials: "JS"
    },
    altText: "John Smith"
  }]}
  style="AVATAR"
  size="SMALL"
  marginBelow="NONE"
/>
```

## Styling Reference

### Text Sizes
- `SMALL` → `text-xs` (12px)
- `STANDARD` → `text-base` (16px)
- `MEDIUM` → `text-lg` (18px)
- `LARGE` → `text-2xl` (24px)

### Spacing
- `NONE` → `p-0`, `m-0` (0)
- `EVEN_LESS` → `p-1`, `m-1` (4px)
- `LESS` → `p-2`, `m-2` (8px)
- `STANDARD` → `p-4`, `m-4` (16px)
- `MORE` → `p-6`, `m-6` (24px)
- `EVEN_MORE` → `p-8`, `m-8` (32px)

### Colors

**Use ONLY these Tailwind color steps: 50, 100, 200, 500, 700, 900**

- **Light backgrounds:** `50`, `100`, `200`
- **Primary elements:** `500`
- **Dark text/borders:** `700`, `900`

**Semantic color mappings:**
- `ACCENT` → `blue-500`
- `POSITIVE` → `green-700`
- `NEGATIVE` → `red-700`
- `SECONDARY` → `gray-700`
- `STANDARD` → `gray-900`

### Shape (Border Radius)
- `SQUARED` → `rounded-none` (0)
- `SEMI_ROUNDED` → `rounded-sm` (4px)
- `ROUNDED` → `rounded-md` (8px)

## Common SAIL Type Definitions

```typescript
type SAILSize = "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
type SAILAlign = "START" | "CENTER" | "END"
type SAILMarginSize = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
type SAILPadding = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
type SAILShape = "SQUARED" | "SEMI_ROUNDED" | "ROUNDED"
type SAILSemanticColor = "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | "STANDARD"
```

## Quick Reference Patterns

### Card with Content
```tsx
<CardLayout padding="STANDARD" showShadow={true}>
  <HeadingField text="Title" size="MEDIUM" marginBelow="STANDARD" />
  <RichTextDisplayField value={["Content here"]} />
</CardLayout>
```

### User Avatar
```tsx
<ImageField
  images={[{
    imageType: 'user' as const,
    user: {
      name: user.name,
      photoUrl: user.imageUrl,
      initials: user.name?.split(' ').map(n => n[0]).join('').toUpperCase()
    },
    altText: user.name
  }]}
  style="AVATAR"
  size="SMALL"
  marginBelow="NONE"
/>
```

### Tags
```tsx
<TagField
  tags={[{ 
    text: "Status",
    backgroundColor: "ACCENT"
  }]}
  size="SMALL"
  marginBelow="NONE"
/>
```

### Buttons
```tsx
<ButtonArrayLayout
  buttons={[
    { label: "Save", style: "SOLID", color: "ACCENT" },
    { label: "Cancel", style: "OUTLINE", color: "SECONDARY" }
  ]}
  align="END"
/>
```

## Development Workflow

### Page Development (Default Location: `src/pages/`)

1. **Check `src/components/index.ts`** for available components
2. **Use existing Sailwind components** wherever possible
3. **Only use raw HTML/libraries** when component truly doesn't exist
4. **Run `npm run build`** frequently to catch TypeScript errors
5. **Add page to TableOfContents.tsx** in the "Pages" group

### Standard Page Structure
```tsx
import { HeadingField, CardLayout } from '../components'

export default function PageName() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <HeadingField
          text="Page Title"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />
        <CardLayout padding="MORE" showShadow={true}>
          {/* Compose existing Sailwind components here */}
        </CardLayout>
      </div>
    </div>
  )
}
```

### Error Resolution Pattern

When encountering "Module has no exported member" errors:

1. Check if it's a data structure (like `UserImage`) vs a component
2. Look for alternative components (like `ImageField`)
3. Review `src/components/index.ts` for available exports
4. Use TypeScript definitions in `node_modules/@pglevy/sailwind/dist/components/`

## Common Mistakes to Avoid

1. ❌ Importing `UserImage` as a component
2. ❌ Using lowercase SAIL parameter values
3. ❌ Using raw HTML when Sailwind component exists
4. ❌ Not checking `src/components/index.ts` first
5. ❌ Using color steps other than 50, 100, 200, 500, 700, 900

## Testing and Validation

### TypeScript Validation
```bash
npm run build  # Run frequently to catch errors
```

## Component vs Page Development

### Component Development (Strict SAIL Compliance)
- Building reusable Sailwind components
- MUST use exact SAIL parameter names (UPPERCASE)
- MUST map to SAIL production code 1:1
- Include SAIL translation examples

### Page Development (Pragmatic Prototyping)
- **Check `src/components/index.ts` FIRST**
- Compose interfaces from existing Sailwind components
- Use practical solutions only when component doesn't exist
- Mark non-SAIL elements with TODO comments

## Resources

- **Sailwind Repo:** https://github.com/pglevy/sailwind
- **SAIL Official Docs:** https://docs.appian.com/suite/help/25.3/
- **Component Index:** `src/components/index.ts`
- **Tailwind CSS:** https://tailwindcss.com/

## Success Criteria

- ✅ Components use exact SAIL parameter names and values (UPPERCASE)
- ✅ Existing Sailwind components used wherever available
- ✅ `npm run build` completes successfully
- ✅ Pages added to TableOfContents.tsx
- ✅ Visual testing passes without errors
- ✅ Consistent Aurora color palette usage
