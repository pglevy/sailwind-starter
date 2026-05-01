#!/usr/bin/env node

/**
 * prepare-eval-env.js
 *
 * Creates a clean copy of the repo suitable for eval runs.
 * Strips example pages, example db files, skills, specs, sessions,
 * and other non-essential files. Keeps the template scaffolding,
 * agent guidance (AGENTS.md, steering), and build tooling.
 *
 * Usage:
 *   node evals/scripts/prepare-eval-env.js <output-dir> [--scenario <path>]
 *
 * Examples:
 *   node evals/scripts/prepare-eval-env.js /tmp/eval-run-1
 *   node evals/scripts/prepare-eval-env.js /tmp/eval-run-1 --scenario evals/inspo/my-health-site
 *
 * When --scenario is provided, the scenario's assets/ are copied into
 * public/ in the output directory.
 */

import { execSync } from 'child_process'
import { existsSync, mkdirSync, cpSync, rmSync, writeFileSync, readFileSync } from 'fs'
import { resolve, join, basename } from 'path'

const ROOT = resolve(import.meta.dirname, '../..')

// ── Parse args ──────────────────────────────────────────────────────

const args = process.argv.slice(2)
const outputDir = args[0]
const scenarioIdx = args.indexOf('--scenario')
const scenarioPath = scenarioIdx !== -1 ? args[scenarioIdx + 1] : null

if (!outputDir) {
  console.error('Usage: node evals/scripts/prepare-eval-env.js <output-dir> [--scenario <path>]')
  process.exit(1)
}

const outPath = resolve(outputDir)

// ── Files/dirs to KEEP (relative to repo root) ─────────────────────

const keepFiles = [
  // Build tooling
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  '.npmrc',
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'postcss.config.js',
  'eslint.config.js',
  'index.html',
  '.gitignore',

  // Agent guidance
  'AGENTS.md',
  'README.md',

  // Source scaffolding
  'src/main.tsx',
  'src/index.css',

  // Utility scripts
  'scripts/check-color-palette.js',
  'scripts/check-sailwind-update.js',
  'scripts/sync-sailwind-components.js',
]

const keepDirs = [
  // Kiro steering + hooks (agent context)
  '.kiro/steering',
  '.kiro/hooks',
  '.kiro/agents',
  '.kiro/settings',

  // Static assets
  'public',

  // Schemas
  'schemas',
]

// ── Files to GENERATE (clean slate versions) ────────────────────────

// Minimal App.tsx with just Home and NotFound
const cleanAppTsx = `import { Route, Router, Switch } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'

import Home from './pages/home'
import NotFound from './pages/not-found'

const pages = [
  { path: '/', title: 'Home', component: Home },
]

function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="min-h-screen bg-gray-50">
        <Switch>
          {pages.map(({ path, component: Component }) => (
            <Route key={path} path={path} component={Component} />
          ))}
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
`

// Minimal home.tsx with empty pages array
const cleanHomeTsx = `import { HeadingField, MessageBanner, RichTextDisplayField, TextItem } from '@pglevy/sailwind'
import { useLocation } from 'wouter'

export default function Home() {
  const [, setLocation] = useLocation()

  const pages: { title: string; path: string; description: string }[] = [
    // Add your pages here
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <HeadingField text="Sailwind Starter" size="LARGE_PLUS" fontWeight="BOLD" align="CENTER" />

      <MessageBanner
        primaryText="Welcome to Sailwind Starter! This template is ready for rapid prototyping with SAIL-style components."
        backgroundColor="INFO"
        highlightColor="INFO"
        icon="info"
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <HeadingField text="Pages" size="MEDIUM_PLUS" fontWeight="SEMI_BOLD" marginBelow="STANDARD" />
        <div className="space-y-3">
          {pages.map((page, index) => (
            <div key={index}>
              <RichTextDisplayField
                value={[
                  <TextItem
                    key="title"
                    text={page.title}
                    color="ACCENT"
                    size="MEDIUM"
                    link={() => setLocation(page.path)}
                    linkStyle="STANDALONE"
                  />,
                  <br key="br" />,
                  <TextItem
                    key="desc"
                    text={page.description}
                    color="SECONDARY"
                    size="STANDARD"
                  />
                ]}
                marginBelow="EVEN_LESS"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
`

// Keep not-found as-is (read from source)
const notFoundTsx = readFileSync(join(ROOT, 'src/pages/not-found.tsx'), 'utf-8')

// Minimal db — just users.ts and types.ts
const usersTsSource = readFileSync(join(ROOT, 'src/db/users.ts'), 'utf-8')
const typesTsSource = readFileSync(join(ROOT, 'src/db/types.ts'), 'utf-8')

// ── Build output directory ──────────────────────────────────────────

console.log(`Creating eval environment at: ${outPath}`)

if (existsSync(outPath)) {
  console.log('  Output directory exists, removing...')
  rmSync(outPath, { recursive: true })
}
mkdirSync(outPath, { recursive: true })

// Copy individual files
for (const file of keepFiles) {
  const src = join(ROOT, file)
  const dest = join(outPath, file)
  if (existsSync(src)) {
    mkdirSync(resolve(dest, '..'), { recursive: true })
    cpSync(src, dest)
    console.log(`  ✓ ${file}`)
  } else {
    console.log(`  ⚠ ${file} (not found, skipping)`)
  }
}

// Copy directories
for (const dir of keepDirs) {
  const src = join(ROOT, dir)
  const dest = join(outPath, dir)
  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true })
    console.log(`  ✓ ${dir}/`)
  } else {
    console.log(`  ⚠ ${dir}/ (not found, skipping)`)
  }
}

// Write clean slate source files
mkdirSync(join(outPath, 'src/pages'), { recursive: true })
mkdirSync(join(outPath, 'src/db'), { recursive: true })

writeFileSync(join(outPath, 'src/App.tsx'), cleanAppTsx)
console.log('  ✓ src/App.tsx (clean)')

writeFileSync(join(outPath, 'src/pages/home.tsx'), cleanHomeTsx)
console.log('  ✓ src/pages/home.tsx (clean)')

writeFileSync(join(outPath, 'src/pages/not-found.tsx'), notFoundTsx)
console.log('  ✓ src/pages/not-found.tsx')

writeFileSync(join(outPath, 'src/db/users.ts'), usersTsSource)
console.log('  ✓ src/db/users.ts')

writeFileSync(join(outPath, 'src/db/types.ts'), typesTsSource)
console.log('  ✓ src/db/types.ts')

// ── Copy scenario assets if provided ────────────────────────────────

if (scenarioPath) {
  const scenarioFullPath = resolve(ROOT, scenarioPath)
  const assetsDir = join(scenarioFullPath, 'assets')

  if (existsSync(assetsDir)) {
    // Copy image assets (not screenshot or source.sail) to public/
    const { readdirSync } = await import('fs')
    const files = readdirSync(assetsDir)
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']

    for (const file of files) {
      if (file === 'screenshot.png' || file === 'source.sail') continue
      const ext = file.substring(file.lastIndexOf('.')).toLowerCase()
      if (imageExts.includes(ext)) {
        cpSync(join(assetsDir, file), join(outPath, 'public', file))
        console.log(`  ✓ public/${file} (from scenario assets)`)
      }
    }
  }

  console.log(`\nScenario: ${scenarioPath}`)
  console.log(`Prompt variants available in: ${join(scenarioFullPath, 'prompt-variants')}`)
}

// ── Install dependencies ────────────────────────────────────────────

console.log('\nInstalling dependencies...')
try {
  execSync('pnpm install --frozen-lockfile', { cwd: outPath, stdio: 'inherit' })
  console.log('  ✓ Dependencies installed')
} catch {
  console.log('  ⚠ pnpm install failed — you may need to run it manually')
}

// ── Verify build ────────────────────────────────────────────────────

console.log('\nVerifying build...')
try {
  execSync('pnpm run build', { cwd: outPath, stdio: 'pipe' })
  console.log('  ✓ Build passes')
} catch (e) {
  console.error('  ✗ Build failed — check the output directory for issues')
  console.error(e.stderr?.toString() || e.message)
}

// ── Summary ─────────────────────────────────────────────────────────

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Eval environment ready at: ${outPath}

Included:
  • Build tooling (Vite, Tailwind, TypeScript)
  • Agent guidance (AGENTS.md, .kiro/steering/)
  • Clean App.tsx with Home + NotFound only
  • Empty src/db/ (users.ts + types.ts only)
  • No example pages or data

Stripped:
  • Example pages (kanban-board, etc.)
  • Example db files (tasks, lists, cards, etc.)
  • .kiro/skills/, specs/, sessions/
  • evals/, appian-output/, gitignore/
  • .claude/, .vscode/, .github/

Next: Open in your IDE and run the eval prompt.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
