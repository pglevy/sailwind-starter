#!/usr/bin/env node

/**
 * Color Palette Checker
 *
 * Scans source files for Tailwind color classes and validates them against
 * the Sailwind design token palette (v0.12.1+).
 *
 * The palette defines 15 color families, each with steps 50–900:
 *   red, burnt-orange, orange, amber, yellow, lime, green, teal,
 *   cyan, sky, blue, violet, purple, pink, gray
 *
 * This script flags:
 *   1. Off-palette color families (e.g. slate, zinc, indigo, rose)
 *   2. Usage is informational — all 10 steps (50–900) are valid per family
 *
 * Usage:
 *   node scripts/check-color-palette.js              # check all src files
 *   node scripts/check-color-palette.js src/pages/home.tsx  # check specific file
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

// Color families defined in the Sailwind palette (from tokens.json / SAILPaletteColor)
const PALETTE_FAMILIES = new Set([
  'red',
  'burnt-orange',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'teal',
  'cyan',
  'sky',
  'blue',
  'violet',
  'purple',
  'pink',
  'gray',
])

// Valid steps for every palette family
const VALID_STEPS = new Set(['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'])

// Tailwind utility prefixes that take color values
const PREFIXES = '(?:bg|text|border|ring|shadow|outline|divide|from|to|via|accent|caret|fill|stroke|decoration)'

// All color family names the regex should match — palette families + common off-palette ones
// We match broadly so we can flag off-palette families as warnings.
const ALL_FAMILIES = [
  // Palette families (order matters: burnt-orange before orange so regex is greedy-correct)
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

      if (!PALETTE_FAMILIES.has(color)) {
        // Off-palette family entirely
        const suggestion = suggestFamily(color)
        warnings.push({
          line: index + 1,
          column: match.index + 1,
          class: fullMatch,
          type: 'off-palette-family',
          message: `"${color}" is not in the Sailwind palette${suggestion ? ` (try ${suggestion})` : ''}`,
        })
      } else if (!VALID_STEPS.has(step)) {
        // Valid family but non-standard step (shouldn't happen with 50-900, but catches e.g. 950)
        warnings.push({
          line: index + 1,
          column: match.index + 1,
          class: fullMatch,
          type: 'invalid-step',
          message: `step ${step} is not defined in the palette (valid: 50–900 in increments of 100, plus 50)`,
        })
      }
    }
  })

  return warnings
}

/**
 * Suggest the closest palette family for an off-palette Tailwind color.
 */
function suggestFamily(family) {
  const suggestions = {
    'slate': 'gray',
    'zinc': 'gray',
    'neutral': 'gray',
    'stone': 'gray',
    'emerald': 'green or teal',
    'indigo': 'blue or violet',
    'fuchsia': 'pink or purple',
    'rose': 'red or pink',
  }
  return suggestions[family] || null
}

// --- Main ---

const args = process.argv.slice(2)
const targetFiles = args.length > 0
  ? args
  : findFiles('src')

let offPaletteCount = 0
let invalidStepCount = 0

for (const file of targetFiles) {
  const warnings = checkFile(file)
  if (warnings.length > 0) {
    const relPath = relative(process.cwd(), file)
    console.log(`\n${relPath}:`)
    for (const w of warnings) {
      console.log(`  Line ${w.line}: "${w.class}" — ${w.message}`)
      if (w.type === 'off-palette-family') offPaletteCount++
      if (w.type === 'invalid-step') invalidStepCount++
    }
  }
}

const totalWarnings = offPaletteCount + invalidStepCount

if (totalWarnings === 0) {
  console.log('✓ All color classes use Sailwind palette families and valid steps')
} else {
  console.log(`\n⚠ Found ${totalWarnings} color class${totalWarnings === 1 ? '' : 'es'} outside the Sailwind palette.`)
  if (offPaletteCount > 0) {
    console.log(`  ${offPaletteCount} using non-palette families (slate, zinc, emerald, indigo, etc.)`)
  }
  if (invalidStepCount > 0) {
    console.log(`  ${invalidStepCount} using invalid steps`)
  }
  console.log('')
  console.log('  Palette families: red, burnt-orange, orange, amber, yellow, lime, green,')
  console.log('                    teal, cyan, sky, blue, violet, purple, pink, gray')
  console.log('  Valid steps:      50, 100, 200, 300, 400, 500, 600, 700, 800, 900')
  console.log('')
  console.log('  These are warnings only — override intentionally if needed.')
}
