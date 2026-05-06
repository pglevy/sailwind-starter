#!/usr/bin/env node

/**
 * Generates a compact prop reference for all Sailwind components.
 * Parses .d.ts files from the installed package and writes
 * .kiro/steering/sail-props.md with a table per component.
 *
 * Called by the predev script automatically.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { resolve } from 'path'

const STEERING_PATH = resolve('.kiro/steering/sail-props.md')
const COMPONENTS_DIR = resolve('node_modules/@pglevy/sailwind/dist/components')

/**
 * Extract the JSDoc comment immediately before a line.
 * Returns the comment text stripped of /** and * / markers.
 */
function extractJsDoc(lines, lineIndex) {
  let i = lineIndex - 1
  while (i >= 0 && lines[i].trim() === '') i--
  if (i < 0 || !lines[i].trim().endsWith('*/')) return ''
  const commentLines = []
  while (i >= 0 && !lines[i].trim().startsWith('/**')) {
    commentLines.unshift(lines[i].trim().replace(/^\* ?/, ''))
    i--
  }
  if (i >= 0) commentLines.unshift(lines[i].trim().replace(/^\/\*\* ?/, '').replace(/ ?\*\/$/, ''))
  return commentLines.join(' ').trim()
}

/**
 * Parse a single .d.ts file and return an array of prop objects.
 * Looks for the first `export interface *Props { ... }` block.
 * Resolves local type aliases (e.g. type ButtonStyle = "SOLID" | "OUTLINE")
 * so the prop table shows concrete values instead of alias names.
 */
function parseProps(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // Collect local type aliases: type Name = "A" | "B" | ...
  const typeAliases = {}
  for (const line of lines) {
    const m = line.match(/^type (\w+) = (.+);$/)
    if (m) typeAliases[m[1]] = m[2]
  }

  // Find the Props interface
  const ifaceStart = lines.findIndex(l => /export interface \w+Props/.test(l))
  if (ifaceStart === -1) return []

  const props = []
  let depth = 0
  let inIface = false

  for (let i = ifaceStart; i < lines.length; i++) {
    const line = lines[i]

    // Track brace depth, but count opens/closes on this line
    const opens = (line.match(/{/g) || []).length
    const closes = (line.match(/}/g) || []).length

    if (!inIface) {
      depth += opens
      inIface = true
      continue
    }

    // Only match props at the top level of the interface (depth 1)
    if (depth === 1) {
      // Match prop lines: propName?: type or propName: type
      const match = line.match(/^\s+(\w+)(\??):\s+(.+?);?\s*$/)
      if (match) {
        const [, name, optional, rawType] = match
        const required = optional !== '?'
        let type = rawType
          .replace(/React\.ReactNode/g, 'ReactNode')
          .replace(/\(\) => void/g, 'function')
          .replace(/\(value\?: any\) => void/g, 'function')
          .replace(/React\.FC<\w+>/g, 'component')
          .trim()

        // For complex inline types (Array<{...}>), simplify to the outer type
        type = type.replace(/Array<\{$/, 'Array(object)')
          .replace(/Record<([^>]+)>/g, 'Record')

        // Resolve local type aliases to their concrete values
        if (typeAliases[type]) {
          type = typeAliases[type]
        }
        // Also resolve union types that reference an alias: e.g. "ButtonStyle | string"
        type = type.replace(/\b(\w+)\b/g, (match) => typeAliases[match] || match)

        const doc = extractJsDoc(lines, i)

        props.push({ name, required, type, doc })
      }
    }

    depth += opens - closes
    if (depth === 0) break
  }

  return props
}

// Props that appear on nearly every component — listed once at the top, omitted from tables
const COMMON_PROPS = new Set([
  'className', 'showWhen', 'marginAbove', 'marginBelow',
  'accessibilityText', 'labelPosition', 'helpTooltip',
  'validationGroup', 'requiredMessage', 'instructions',
])

/**
 * Format props as a compact markdown table, omitting common props.
 */
function propsToTable(props) {
  const filtered = props.filter(p => !COMMON_PROPS.has(p.name))
  if (filtered.length === 0) return '_No unique props_\n'
  const rows = filtered.map(p => {
    const req = p.required ? '✓' : ''
    // Clean up types for markdown table safety:
    // - Remove quotes from union types, use / instead of |
    // - Replace < > with ( ) to avoid markdown HTML parsing
    // - Fix => arrows that got mangled by the ) replacement
    const type = p.type
      .replace(/"/g, '')
      .replace(/ \| /g, ' / ')
      .replace(/\|/g, '/')
      .replace(/</g, '(')
      .replace(/>/g, ')')
      .replace(/=\) /g, '=> ')
    const doc = p.doc.replace(/\|/g, '\\|')
    return `| \`${p.name}\` | \`${type}\` | ${req} | ${doc} |`
  })
  return [
    '| Prop | Type | Req | Description |',
    '|------|------|:---:|-------------|',
    ...rows,
  ].join('\n') + '\n'
}

try {
  const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true })

  // Map component name → props by scanning each folder's .d.ts files
  const components = {}

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const dir = resolve(COMPONENTS_DIR, entry.name)
    const dtsFiles = readdirSync(dir).filter(f => f.endsWith('.d.ts') && !f.includes('stories') && f !== 'index.d.ts')

    for (const file of dtsFiles) {
      // Only process files that export a component (PascalCase, not base/internal)
      if (file.includes('Base') || file.includes('assets')) continue
      const componentName = file.replace('.d.ts', '')
      if (!/^[A-Z]/.test(componentName)) continue

      const props = parseProps(resolve(dir, file))
      if (props.length > 0) {
        components[componentName] = props
      }
    }
  }

  const sorted = Object.keys(components).sort()

  // Check if update needed
  let current = ''
  try { current = readFileSync(STEERING_PATH, 'utf-8') } catch { /* new file */ }
  if (current.includes(`**${sorted.length} components**`) && sorted.every(n => current.includes(`### ${n}`))) {
    process.exit(0)
  }

  const sections = sorted.map(name => {
    return `### ${name}\n\n${propsToTable(components[name])}`
  }).join('\n')

  const output = `---
inclusion: fileMatch
fileMatchPattern: "src/pages/**"
---

# Sailwind Component Props Reference

All props for every Sailwind component, parsed from the installed package. Use exact prop names and values — do not guess.

**${sorted.length} components** | All prop values must be UPPERCASE where the type is a SAIL enum.

## Common Props (omitted from tables below)

Most components accept these optional props. They are not repeated in each table:

| Prop | Type | Description |
|------|------|-------------|
| \`className\` | \`string\` | Additional Tailwind classes for prototype-specific styling (not part of SAIL API) |
| \`showWhen\` | \`boolean\` | Controls component visibility |
| \`marginAbove\` | \`SAILMarginSize\` | Space added above component |
| \`marginBelow\` | \`SAILMarginSize\` | Space added below component |
| \`accessibilityText\` | \`string\` | Additional text for screen readers |
| \`labelPosition\` | \`SAILLabelPosition\` | Where the label appears (ABOVE / ADJACENT / COLLAPSED / JUSTIFIED) |
| \`helpTooltip\` | \`string\` | Displays a help icon with tooltip text |
| \`instructions\` | \`string\` | Supplemental text about this field |
| \`validationGroup\` | \`string\` | Validation group name (no spaces) |
| \`requiredMessage\` | \`string\` | Custom message when required and not provided |

${sections}`

  writeFileSync(STEERING_PATH, output)
  console.log(`  ✅ Updated .kiro/steering/sail-props.md with props for ${sorted.length} components.`)
} catch (err) {
  // Silently ignore — don't block anything
}
