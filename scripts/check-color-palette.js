#!/usr/bin/env node

/**
 * Color Palette Checker
 *
 * Scans source files for Tailwind color classes that use color steps
 * outside the approved palette: 50, 100, 200, 500, 700, 900.
 *
 * This is a soft warning tool for prototyping — not a hard gate.
 * Off-palette colors like gray-300 or blue-400 will be flagged
 * so you can decide if they're intentional.
 *
 * Usage:
 *   node scripts/check-color-palette.js              # check all src files
 *   node scripts/check-color-palette.js src/pages/home.tsx  # check specific file
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

const APPROVED_STEPS = new Set(['50', '100', '200', '500', '700', '900'])

// Matches Tailwind color utilities like bg-blue-300, text-gray-400, border-red-600, etc.
// Captures: prefix (bg, text, border, etc.), color name, and numeric step
const COLOR_CLASS_REGEX = /\b(bg|text|border|ring|shadow|outline|divide|from|to|via|accent|caret|fill|stroke|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(\d+)\b/g

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
      if (!APPROVED_STEPS.has(step)) {
        warnings.push({
          line: index + 1,
          column: match.index + 1,
          class: fullMatch,
          step,
          suggestion: suggestStep(parseInt(step)),
        })
      }
    }
  })

  return warnings
}

function suggestStep(step) {
  if (step <= 75) return '50'
  if (step <= 150) return '100'
  if (step <= 350) return '200'
  if (step <= 600) return '500'
  if (step <= 800) return '700'
  return '900'
}

// --- Main ---

const args = process.argv.slice(2)
const targetFiles = args.length > 0
  ? args
  : findFiles('src')

let totalWarnings = 0

for (const file of targetFiles) {
  const warnings = checkFile(file)
  if (warnings.length > 0) {
    const relPath = relative(process.cwd(), file)
    console.log(`\n${relPath}:`)
    for (const w of warnings) {
      console.log(`  Line ${w.line}: "${w.class}" uses step ${w.step} (try ${w.suggestion} instead)`)
      totalWarnings++
    }
  }
}

if (totalWarnings === 0) {
  console.log('✓ All color classes use approved palette steps (50, 100, 200, 500, 700, 900)')
} else {
  console.log(`\n⚠ Found ${totalWarnings} color class${totalWarnings === 1 ? '' : 'es'} using non-standard steps.`)
  console.log('  Approved steps: 50, 100, 200, 500, 700, 900')
  console.log('  These are warnings only — override intentionally if needed.')
}
