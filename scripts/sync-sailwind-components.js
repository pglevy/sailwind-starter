#!/usr/bin/env node

/**
 * Syncs the list of available Sailwind components to the steering file.
 * Reads actual exports from the @pglevy/sailwind package and regenerates
 * .kiro/steering/sail-components.md if anything has changed.
 *
 * Called by the predev script automatically.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { resolve } from 'path'

const STEERING_PATH = resolve('.kiro/steering/sail-components.md')
const COMPONENTS_DIR = resolve('node_modules/@pglevy/sailwind/dist/components')

try {
  const componentNames = new Set()

  // Read each subfolder's index.d.ts only — that's the public API
  const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const indexPath = resolve(COMPONENTS_DIR, entry.name, 'index.d.ts')
    if (!existsSync(indexPath)) continue

    const content = readFileSync(indexPath, 'utf-8')

    // Match named exports but skip type-only exports (Props interfaces)
    // Pattern: export { Name } from './Name'  (but NOT: export type { NameProps })
    const matches = content.matchAll(/^export \{ (\w+) \}/gm)
    for (const m of matches) {
      if (/^[A-Z]/.test(m[1])) componentNames.add(m[1])
    }
  }

  const sorted = [...componentNames].sort()

  // Check if steering file needs updating
  let currentSteering = ''
  try {
    currentSteering = readFileSync(STEERING_PATH, 'utf-8')
  } catch {
    // File doesn't exist yet
  }

  const allPresent = sorted.every(name => currentSteering.includes(name))
  if (allPresent && currentSteering) {
    process.exit(0)
  }

  // Categorize components for readability
  const categories = {
    'Layout': ['CardLayout', 'CollapsibleSection', 'ApplicationHeader', 'SideNavAdmin'],
    'Display': ['HeadingField', 'RichTextDisplayField', 'TextItem', 'Icon', 'ImageField', 'MessageBanner', 'TagField', 'TagItem', 'StampField', 'ProgressBar', 'MilestoneField'],
    'Input': ['TextField', 'DropdownField', 'MultipleDropdownField', 'CheckboxField', 'RadioButtonField', 'SwitchField', 'ToggleField', 'SliderField'],
    'Actions': ['ButtonWidget', 'ButtonArrayLayout', 'DialogField', 'TabsField'],
    'Utility': ['FieldLabel', 'FieldWrapper'],
  }

  const categorized = new Set(Object.values(categories).flat())
  const uncategorized = sorted.filter(name => !categorized.has(name))

  let componentList = ''
  for (const [category, names] of Object.entries(categories)) {
    const available = names.filter(n => sorted.includes(n))
    if (available.length > 0) {
      componentList += `\n**${category}:** ${available.map(n => '`' + n + '`').join(', ')}\n`
    }
  }
  if (uncategorized.length > 0) {
    componentList += `\n**Other:** ${uncategorized.map(n => '`' + n + '`').join(', ')}\n`
  }

  const content = `---
inclusion: fileMatch
fileMatchPattern: "src/pages/**"
---

# Available Sailwind Components

Import these from \`@pglevy/sailwind\`. Do not look in \`src/components/\` for these — they come from the npm package. Use exact names (case-sensitive).

\`\`\`tsx
import { ComponentName } from '@pglevy/sailwind'
\`\`\`
${componentList}
**Total: ${sorted.length} components**

Common name mistakes to avoid:
- ❌ \`Button\` → ✅ \`ButtonWidget\`
- ❌ \`Card\` → ✅ \`CardLayout\`
- ❌ \`Text\` → ✅ \`TextItem\` or \`RichTextDisplayField\`
- ❌ \`Heading\` → ✅ \`HeadingField\`
- ❌ \`Tabs\` → ✅ \`TabsField\`
- ❌ \`Tag\` → ✅ \`TagField\`
`

  writeFileSync(STEERING_PATH, content)
  console.log(`  ✅ Updated .kiro/steering/sail-components.md with ${sorted.length} components from package.`)
} catch (err) {
  // Silently ignore — don't block anything
}
