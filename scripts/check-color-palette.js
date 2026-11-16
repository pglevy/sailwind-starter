#!/usr/bin/env node

/**
 * Color Palette Checker
 *
 * Scans source files for Tailwind color classes and validates them against
 * the Sailwind design token palette.
 *
 * The palette defines 22 color families, each with steps 50–950:
 *   slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime,
 *   green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia,
 *   pink, rose
 *
 * This script flags:
 *   1. Removed families from the previous palette (e.g. burnt-orange) — these
 *      no longer exist and have no direct replacement, so they must be changed
 *      intentionally.
 *   2. Off-palette families that were never part of the Sailwind palette.
 *   3. Invalid steps (valid: 50–950).
 *
 * Usage:
 *   node scripts/check-color-palette.js              # check all src files
 *   node scripts/check-color-palette.js src/pages/home.tsx  # check specific file
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

// Color families defined in the Sailwind palette (from tokens.json / SAILPaletteColor)
const PALETTE_FAMILIES = new Set([
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
])

// Families that existed in a previous Sailwind palette but have since been
// removed. These have no direct replacement — flag them loudly so they get
// changed intentionally rather than silently rendering without a color.
const REMOVED_FAMILIES = new Set([
  'burnt-orange',
])

// Valid steps for every palette family
const VALID_STEPS = new Set(['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'])

// Tailwind utility prefixes that take color values
const PREFIXES = '(?:bg|text|border|ring|shadow|outline|divide|from|to|via|accent|caret|fill|stroke|decoration)'

// All color family names the regex should match — palette families, removed
// families, and common off-palette ones. We match broadly so we can flag
// anything that isn't a current palette family.
const ALL_FAMILIES = [
  // Multi-word / removed families first so the regex alternation matches them
  // before a shorter prefix (e.g. burnt-orange before orange).
  'burnt-orange',
  // Standard Tailwind families (superset)
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
]

// Build regex: prefix-family-step
// burnt-orange must come before orange in alternation to match correctly
const FAMILY_PATTERN = ALL_FAMILIES.join('|')
const COLOR_CLASS_REGEX = new RegExp(
  `\\b(${PREFIXES})-(${FAMILY_PATTERN})-(\\d+)\\b`,
  'g'
)

function findFiles(dir, extensions = ['.tsx', '.jsx', '.ts', '.css']) {
  const results = []
  for (const entry of readdirSync(dir)) {
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

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const warnings = []

  lines.forEach((line, index) => {
    let match
    COLOR_CLASS_REGEX.lastIndex = 0
    while ((match = COLOR_CLASS_REGEX.exec(line)) !== null) {
      const [fullMatch, prefix, color, step] = match

      if (REMOVED_FAMILIES.has(color)) {
        // Family was removed from the palette — no direct replacement.
        warnings.push({
          line: index + 1,
          column: match.index + 1,
          class: fullMatch,
          type: 'removed-family',
          message: `"${color}" was removed from the Sailwind palette — there is no direct replacement, so pick a new color intentionally`,
        })
      } else if (!PALETTE_FAMILIES.has(color)) {
        // Off-palette family entirely
        warnings.push({
          line: index + 1,
          column: match.index + 1,
          class: fullMatch,
          type: 'off-palette-family',
          message: `"${color}" is not in the Sailwind palette`,
        })
      } else if (!VALID_STEPS.has(step)) {
        // Valid family but non-standard step
        warnings.push({
          line: index + 1,
          column: match.index + 1,
          class: fullMatch,
          type: 'invalid-step',
          message: `step ${step} is not defined in the palette (valid: 50–950)`,
        })
      }
    }
  })

  return warnings
}

// --- Main ---

const args = process.argv.slice(2)
const targetFiles = args.length > 0
  ? args
  : findFiles('src')

let removedCount = 0
let offPaletteCount = 0
let invalidStepCount = 0

for (const file of targetFiles) {
  const warnings = checkFile(file)
  if (warnings.length > 0) {
    const relPath = relative(process.cwd(), file)
    console.log(`\n${relPath}:`)
    for (const w of warnings) {
      console.log(`  Line ${w.line}: "${w.class}" — ${w.message}`)
      if (w.type === 'removed-family') removedCount++
      if (w.type === 'off-palette-family') offPaletteCount++
      if (w.type === 'invalid-step') invalidStepCount++
    }
  }
}

const totalWarnings = removedCount + offPaletteCount + invalidStepCount

if (totalWarnings === 0) {
  console.log('✓ All color classes use Sailwind palette families and valid steps')
} else {
  console.log(`\n⚠ Found ${totalWarnings} color class${totalWarnings === 1 ? '' : 'es'} outside the Sailwind palette.`)
  if (removedCount > 0) {
    console.log(`  ${removedCount} using removed families (burnt-orange) — these need a new color`)
  }
  if (offPaletteCount > 0) {
    console.log(`  ${offPaletteCount} using non-palette families`)
  }
  if (invalidStepCount > 0) {
    console.log(`  ${invalidStepCount} using invalid steps`)
  }
  console.log('')
  console.log('  Palette families: slate, gray, zinc, neutral, stone, red, orange, amber,')
  console.log('                    yellow, lime, green, emerald, teal, cyan, sky, blue,')
  console.log('                    indigo, violet, purple, fuchsia, pink, rose')
  console.log('  Valid steps:      50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950')
  console.log('')
  console.log('  These are warnings only — override intentionally if needed.')
}
