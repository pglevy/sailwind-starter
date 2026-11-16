#!/usr/bin/env node

/**
 * Checks if a newer version of @pglevy/sailwind is available.
 * Runs as a predev hook so developers get a heads-up before starting work.
 * Non-blocking — exits 0 regardless so it never prevents dev server from starting.
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const PACKAGE = '@pglevy/sailwind'

try {
  const output = execSync(`pnpm outdated ${PACKAGE} --json`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  const data = JSON.parse(output)
  const info = data[PACKAGE]

  if (info && info.current !== info.latest) {
    console.log('')
    console.log(`  ⬆️  Sailwind update available: ${info.current} → ${info.latest}`)
    console.log(`     Run: pnpm add ${PACKAGE}@latest`)
    console.log('')
  }
} catch (err) {
  // npm outdated exits with code 1 when packages are outdated, so we
  // need to handle that case by parsing stdout from the error object.
  if (err.stdout) {
    try {
      const data = JSON.parse(err.stdout)
      const info = data[PACKAGE]
      if (info && info.current !== info.latest) {
        console.log('')
        console.log(`  ⬆️  Sailwind update available: ${info.current} → ${info.latest}`)
        console.log(`     Run: pnpm add ${PACKAGE}@latest`)
        console.log('')
      }
    } catch {
      // JSON parse failed — silently ignore
    }
  }
  // Never block the dev server
}

// --- Sync steering file types with package ---

const STEERING_PATH = resolve('.kiro/steering/sail-types.md')

try {
  const typesDir = resolve('node_modules/@pglevy/sailwind/dist/types')
  const sailDts = readFileSync(resolve(typesDir, 'sail.d.ts'), 'utf-8')

  // Single-line type aliases: `export type Name = ...;`
  // (re-exports like `export type { Name } from '...'` are skipped on purpose)
  const typeLines = [...sailDts.matchAll(/^export type (\w+) = (.+);$/gm)].map(
    ([, name, value]) => `type ${name} = ${value}`
  )

  // Interfaces referenced by component props (e.g. SortInfo, SAILDynamicLink).
  // Doc comments are dropped to keep the steering file compact.
  const interfaceBlocks = [...sailDts.matchAll(/^export interface \w+ \{[\s\S]*?^\}/gm)].map(
    ([block]) =>
      block
        .replace(/^export /, '')
        .split('\n')
        .filter(line => !/^\s*(\/\*\*|\*)/.test(line))
        .join('\n')
  )

  // The palette union is generated and huge — summarize it as FAMILY_STEP.
  let paletteLine = ''
  try {
    const paletteDts = readFileSync(resolve(typesDir, 'palette-colors.generated.d.ts'), 'utf-8')
    const union = paletteDts.match(/export type SAILPaletteColor = (.+);/)?.[1]
    if (union) {
      const families = []
      const steps = []
      for (const token of union.split('|').map(t => t.trim().replace(/'/g, ''))) {
        const m = token.match(/^(.+)_(\d+)$/)
        if (!m) continue
        if (!families.includes(m[1])) families.push(m[1])
        if (!steps.includes(m[2])) steps.push(m[2])
      }
      paletteLine = `// SAILPaletteColor is FAMILY_STEP, e.g. TEAL_700 or BURNT_ORANGE_50\n// FAMILY: ${families.join(' | ')}\n// STEP: ${steps.join(' | ')}\ntype SAILPaletteColor = \`\${FAMILY}_\${STEP}\``
    }
  } catch {
    // Palette file missing — fall back to the bare SAILColor line
  }

  if (typeLines.length > 0) {
    // sail.d.ts aliases the palette import as _PaletteColor — use the public name
    const typesBlock = [
      ...typeLines.map(line => line.replace(/\b_PaletteColor\b/g, 'SAILPaletteColor')),
      ...(paletteLine ? [paletteLine] : []),
      ...interfaceBlocks,
    ].join('\n')

    const content = `---
inclusion: fileMatch
fileMatchPattern: "src/pages/**"
---

# SAIL Type Definitions

When building pages with Sailwind components, use these exact type values for component parameters. These are the actual types from the \`@pglevy/sailwind\` package. Do not guess or assume values outside these sets.

\`\`\`typescript
${typesBlock}
\`\`\`

All parameter values must be UPPERCASE. These are the only valid values — if a component prop expects one of these types, use only the values listed here.
`

    let steering = ''
    try {
      steering = readFileSync(STEERING_PATH, 'utf-8')
    } catch {
      // Steering file doesn't exist yet — we'll create it
    }

    // Compare full content so removed or changed types are picked up too
    if (steering !== content) {
      writeFileSync(STEERING_PATH, content)
      console.log('')
      console.log('  ✅ Updated .kiro/steering/sail-types.md with latest SAIL types from package.')
      console.log('')
    }
  }
} catch {
  // Package types file missing — silently ignore
}

// --- Sync steering file components with package ---

try {
  execSync('node scripts/sync-sailwind-components.js', {
    encoding: 'utf-8',
    stdio: 'inherit',
  })
} catch {
  // Silently ignore
}

// --- Sync steering file props with package ---

try {
  execSync('node scripts/sync-sailwind-props.js', {
    encoding: 'utf-8',
    stdio: 'inherit',
  })
} catch {
  // Silently ignore
}
