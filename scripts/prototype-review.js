#!/usr/bin/env node

/**
 * Prototype Review
 *
 * Scans src/pages/ and src/db/ for violations of this project's core
 * conventions (see AGENTS.md):
 *   1. Components must be imported from @pglevy/sailwind
 *   2. SAIL prop values must be UPPERCASE
 *   3. Lucide icons, not emoji
 *   4. Data must live in src/db/, never inlined in pages
 *   Plus: every page in src/pages/ should be registered in src/App.tsx
 *
 * This is advisory, like scripts/check-color-palette.js — it never fails
 * the build, it just surfaces things worth a second look.
 *
 * Usage:
 *   node scripts/prototype-review.js              # review all pages
 *   node scripts/prototype-review.js src/pages/x.tsx
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative, basename } from 'path'

function findFiles(dir, extensions = ['.tsx', '.jsx']) {
  const results = []
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return results
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory() && entry !== 'node_modules' && entry !== 'dist' && entry !== '.git') {
      results.push(...findFiles(fullPath, extensions))
    } else if (extensions.some(ext => entry.endsWith(ext))) {
      results.push(fullPath)
    }
  }
  return results
}

// Props whose SAIL type is a known enum — values on these should be UPPERCASE.
// Not exhaustive, but covers the common ones designers hit most.
// Note: a few props (like MessageBanner's `icon`) are intentionally lowercase
// per their actual SAIL type — keep this list to props that are genuinely
// UPPERCASE enums, and expand with care if false positives show up.
const ENUM_PROPS = [
  'size', 'style', 'color', 'align', 'labelPosition', 'backgroundColor',
  'highlightColor', 'headingTag', 'marginAbove', 'marginBelow', 'fontWeight',
  'linkStyle', 'padding', 'width', 'shape', 'validation',
]

const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu

const args = process.argv.slice(2)
const pageFiles = args.length > 0 ? args : findFiles('src/pages')
const dbFiles = findFiles('src/db', ['.ts'])

const findings = { high: [], medium: [], low: [] }

function addFinding(severity, file, line, message) {
  findings[severity].push({ file: relative(process.cwd(), file), line, message })
}

// --- Rule 1: imports from @pglevy/sailwind only (no src/components, no other UI libs) ---

for (const file of pageFiles) {
  const content = readFileSync(file, 'utf-8')
  const lines = content.split('\n')
  lines.forEach((line, i) => {
    const componentImportMatch = line.match(/^import\s+.*from\s+['"](.+)['"]/)
    if (componentImportMatch) {
      const source = componentImportMatch[1]
      if (source.includes('src/components') || source.startsWith('../components') || source.startsWith('./components')) {
        addFinding('high', file, i + 1, `Imports from src/components/ instead of @pglevy/sailwind — "${line.trim()}"`)
      }
    }
  })

  // Raw HTML form elements that usually have a Sailwind equivalent
  const rawElementMatches = content.matchAll(/<(button|input|select|textarea)[\s>]/g)
  for (const m of rawElementMatches) {
    const upTo = content.slice(0, m.index)
    const lineNum = upTo.split('\n').length
    addFinding('medium', file, lineNum, `Raw <${m[1]}> element found — check if a Sailwind component (ButtonWidget, TextField, DropdownField, etc.) should be used instead`)
  }
}

// --- Rule 2: UPPERCASE SAIL prop values ---

for (const file of pageFiles) {
  const content = readFileSync(file, 'utf-8')
  const lines = content.split('\n')
  const propPattern = new RegExp(`\\b(${ENUM_PROPS.join('|')})=["']([a-z][a-z_]*)["']`, 'g')
  lines.forEach((line, i) => {
    let match
    propPattern.lastIndex = 0
    while ((match = propPattern.exec(line)) !== null) {
      addFinding('high', file, i + 1, `Prop "${match[1]}" has lowercase value "${match[2]}" — SAIL enum values must be UPPERCASE (e.g. "${match[2].toUpperCase()}")`)
    }
  })
}

// --- Rule 3: emoji instead of Lucide icons ---

for (const file of pageFiles) {
  const content = readFileSync(file, 'utf-8')
  const lines = content.split('\n')
  lines.forEach((line, i) => {
    const matches = line.match(EMOJI_REGEX)
    if (matches) {
      addFinding('medium', file, i + 1, `Emoji found (${matches.join(' ')}) — use a Lucide icon instead, e.g. import { CheckCircle } from 'lucide-react'`)
    }
  })
}

// --- Rule 4: data inlined in pages instead of src/db/ ---

for (const file of pageFiles) {
  const content = readFileSync(file, 'utf-8')
  const lines = content.split('\n')

  // Heuristic: a const assigned to an array of 2+ object literals, each with
  // multiple keys, that isn't the small route-list pattern used on home.tsx.
  const arrayLiteralMatches = content.matchAll(/const\s+(\w+)\s*(?::\s*[\w<>[\]]+)?\s*=\s*\[\s*\{[^}]*:\s*[^}]*\}[^\]]*\{/gs)
  for (const m of arrayLiteralMatches) {
    const upTo = content.slice(0, m.index)
    const lineNum = upTo.split('\n').length
    // Skip small config-like arrays (route lists, tab lists) that commonly live in pages
    if (/pages|tabs|routes|links|steps|options/i.test(m[1])) continue
    addFinding('medium', file, lineNum, `Array literal "${m[1]}" looks like inline data — prototype data should live in src/db/ as a typed async function (see .kiro/steering/data-layer.md)`)
  }

  // Pages that never import from '../db/' or '../../db/' at all are worth a second look
  // (skip home.tsx and not-found.tsx, which legitimately have no data)
  const looksLikeDataPage = /useState/.test(content)
  const importsFromDb = /from ['"]\.\.?\/(\.\.\/)?db\//.test(content)
  const skip = ['home.tsx', 'not-found.tsx'].includes(basename(file))
  if (looksLikeDataPage && !importsFromDb && !skip) {
    addFinding('low', file, 1, `Page uses useState but doesn't import anything from src/db/ — confirm any data shown here isn't hardcoded`)
  }
}

// --- Bonus: pages not registered in src/App.tsx ---

try {
  const appContent = readFileSync('src/App.tsx', 'utf-8')
  const allPageFiles = findFiles('src/pages')
  for (const file of allPageFiles) {
    const slug = basename(file).replace(/\.(tsx|jsx)$/, '')
    if (slug === 'not-found') continue
    const importedInApp = new RegExp(`from ['"]\\./pages/${slug}['"]`).test(appContent)
    if (!importedInApp) {
      addFinding('medium', file, 1, `src/pages/${slug}.tsx exists but isn't imported/routed in src/App.tsx`)
    }
  }
} catch {
  // App.tsx not found — skip this check
}

// --- Bonus: entity modules in src/db/ missing the id-first / CRUD convention ---

for (const file of dbFiles) {
  if (basename(file) === 'types.ts' || basename(file) === 'api-config.ts' || basename(file) === 'users.ts') continue
  const content = readFileSync(file, 'utf-8')
  const interfaceMatch = content.match(/export interface (\w+) \{\s*([^}]*)\}/s)
  if (interfaceMatch) {
    const firstField = interfaceMatch[2].trim().split('\n')[0].trim()
    if (!/^id\s*:\s*number/.test(firstField)) {
      addFinding('low', file, 1, `Interface "${interfaceMatch[1]}" doesn't start with "id: number" — see data-layer.md convention`)
    }
  }
}

// --- Report ---

const total = findings.high.length + findings.medium.length + findings.low.length

function printGroup(title, emoji, items) {
  if (items.length === 0) return
  console.log(`\n${emoji} ${title} (${items.length})`)
  for (const f of items) {
    console.log(`  ${f.file}:${f.line} — ${f.message}`)
  }
}

if (total === 0) {
  console.log('✓ No issues found against the four non-negotiable rules, routing, or data-layer conventions.')
} else {
  console.log(`Prototype review found ${total} item${total === 1 ? '' : 's'} worth a look:`)
  printGroup('Fix before calling this done', '🔴', findings.high)
  printGroup('Worth checking', '🟡', findings.medium)
  printGroup('Good to know', '🟢', findings.low)
  console.log('\nThis is advisory — some findings may be false positives. Use judgment.')
}
