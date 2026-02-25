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
  const output = execSync(`npm outdated ${PACKAGE} --json`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  const data = JSON.parse(output)
  const info = data[PACKAGE]

  if (info && info.current !== info.latest) {
    console.log('')
    console.log(`  ⬆️  Sailwind update available: ${info.current} → ${info.latest}`)
    console.log(`     Run: npm install ${PACKAGE}@latest`)
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
        console.log(`     Run: npm install ${PACKAGE}@latest`)
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
  const sailDts = readFileSync(
    resolve('node_modules/@pglevy/sailwind/dist/types/sail.d.ts'),
    'utf-8'
  )

  // Extract type definitions from the .d.ts file
  const typeLines = sailDts
    .match(/^export type .+$/gm)
    ?.map(line => line.replace(/^export /, '').replace(';', ''))

  if (typeLines) {
    let steering = ''
    try {
      steering = readFileSync(STEERING_PATH, 'utf-8')
    } catch {
      // Steering file doesn't exist yet — we'll create it
    }

    const missing = typeLines.filter(line => !steering.includes(line))
    if (missing.length > 0 || !steering) {
      const typesBlock = typeLines.join('\n')
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
