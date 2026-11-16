#!/usr/bin/env node

/**
 * Scaffolds a new prototype page:
 *   1. Creates src/pages/<slug>.tsx from a starter template
 *   2. Registers the route (import + pages array) in src/App.tsx
 *   3. Adds an entry to the pages list in src/pages/home.tsx (best-effort)
 *
 * Usage:
 *   node scripts/scaffold-page.js --name "Task Dashboard" [--description "..."] [--path /task-dashboard]
 *
 * Flags:
 *   --name         Required. Page title, e.g. "Task Dashboard" or "task-dashboard"
 *   --description  Optional. One-line description used on the home page list
 *   --path         Optional. Route path. Defaults to a kebab-case slug of --name
 *   --force        Optional. Overwrite the page file if it already exists
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        args[key] = next
        i++
      } else {
        args[key] = true
      }
    }
  }
  return args
}

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toPascalCase(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/**
 * Inserts a new entry into a `const pages = [ ... ]` style array literal,
 * matching the indentation already used by its existing entries.
 */
function insertArrayEntry(arrayBlock, entryLine) {
  const entryIndent = arrayBlock.match(/\n(\s+)\{/)?.[1] ?? '  '
  const closingIndent = arrayBlock.match(/\n(\s*)\]\s*$/)?.[1] ?? ''
  const withoutClosing = arrayBlock.replace(/\s*\]\s*$/, '')
  return `${withoutClosing}\n${entryIndent}${entryLine}\n${closingIndent}]`
}

function toTitleCase(input) {
  // If the input already looks like a title (has uppercase or spaces), keep it.
  // Otherwise, title-case a slug.
  if (/[A-Z]/.test(input) || /\s/.test(input)) return input.trim()
  return input
    .split(/[-_]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const args = parseArgs(process.argv.slice(2))

if (!args.name) {
  console.error('Usage: node scripts/scaffold-page.js --name "Task Dashboard" [--description "..."] [--path /task-dashboard]')
  process.exit(1)
}

const title = toTitleCase(String(args.name))
const slug = slugify(String(args.name))
const componentName = toPascalCase(slug)
const routePath = args.path ? String(args.path) : `/${slug}`
const description = args.description ? String(args.description) : ''

const PAGE_PATH = resolve(`src/pages/${slug}.tsx`)
const APP_PATH = resolve('src/App.tsx')
const HOME_PATH = resolve('src/pages/home.tsx')

// --- 1. Create the page file ---

if (existsSync(PAGE_PATH) && !args.force) {
  console.error(`✗ src/pages/${slug}.tsx already exists. Use --force to overwrite.`)
  process.exit(1)
}

const pageTemplate = `import { HeadingField, CardLayout } from '@pglevy/sailwind'

export default function ${componentName}() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <HeadingField text="${title}" size="LARGE" headingTag="H1" marginBelow="MORE" />

      <CardLayout padding="MORE" showShadow={true}>
        <p>Start building ${title} here.</p>
      </CardLayout>
    </div>
  )
}
`

writeFileSync(PAGE_PATH, pageTemplate)
console.log(`✓ Created src/pages/${slug}.tsx`)

// --- 2. Register the route in App.tsx ---

let appContent = readFileSync(APP_PATH, 'utf-8')
let appChanged = false

const importLine = `import ${componentName} from './pages/${slug}'`
if (!appContent.includes(importLine)) {
  // Insert after the last page import (a line starting with "import" that
  // references './pages/'), falling back to right after the wouter imports.
  const importLines = [...appContent.matchAll(/^import .+ from '\.\/pages\/.+'$/gm)]
  if (importLines.length > 0) {
    const last = importLines[importLines.length - 1]
    const insertAt = last.index + last[0].length
    appContent = appContent.slice(0, insertAt) + `\n${importLine}` + appContent.slice(insertAt)
  } else {
    // Fall back: insert after the last top-level import statement
    const allImports = [...appContent.matchAll(/^import .+$/gm)]
    const last = allImports[allImports.length - 1]
    const insertAt = last.index + last[0].length
    appContent = appContent.slice(0, insertAt) + `\n${importLine}` + appContent.slice(insertAt)
  }
  appChanged = true
}

const routeEntry = `  { path: '${routePath}', title: '${title}', component: ${componentName} },`
if (!appContent.includes(`component: ${componentName} `) && !appContent.includes(`component: ${componentName},`) && !appContent.includes(`component: ${componentName} }`)) {
  const pagesArrayMatch = appContent.match(/const pages = \[[^\]]*\]/s)
  if (pagesArrayMatch) {
    const arrayBlock = pagesArrayMatch[0]
    const newArrayBlock = insertArrayEntry(arrayBlock, routeEntry.trim())
    appContent = appContent.replace(arrayBlock, newArrayBlock)
    appChanged = true
  } else {
    console.warn('⚠ Could not find a `const pages = [...]` array in src/App.tsx — add the route manually:')
    console.warn(`  ${routeEntry}`)
  }
}

if (appChanged) {
  writeFileSync(APP_PATH, appContent)
  console.log(`✓ Registered route ${routePath} in src/App.tsx`)
} else {
  console.log(`• Route for ${componentName} already present in src/App.tsx`)
}

// --- 3. Add entry to home.tsx pages list (best-effort) ---

if (existsSync(HOME_PATH)) {
  let homeContent = readFileSync(HOME_PATH, 'utf-8')
  const homePagesMatch = homeContent.match(/const pages = \[[^\]]*\]/s)

  if (homePagesMatch && !homeContent.includes(`path: '${routePath}'`)) {
    const arrayBlock = homePagesMatch[0]
    const homeEntry = `{ title: '${title}', path: '${routePath}', description: '${description || `Describe ${title} here`}' },`
    const newArrayBlock = insertArrayEntry(arrayBlock, homeEntry)
    homeContent = homeContent.replace(arrayBlock, newArrayBlock)
    writeFileSync(HOME_PATH, homeContent)
    console.log(`✓ Added "${title}" to the pages list in src/pages/home.tsx`)
  } else if (homePagesMatch) {
    console.log(`• Entry for ${routePath} already present in src/pages/home.tsx`)
  } else {
    console.warn('⚠ Could not find a `const pages = [...]` array in src/pages/home.tsx — add a link to the new page manually.')
  }
} else {
  console.warn('⚠ src/pages/home.tsx not found — skipped home page link. Add one manually if this project uses a home page index.')
}

console.log('')
console.log(`Done. Open src/pages/${slug}.tsx and start building — it's already routed at ${routePath}.`)
