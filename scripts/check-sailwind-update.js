#!/usr/bin/env node

/**
 * Checks if a newer version of @pglevy/sailwind is available.
 * Runs as a predev hook so developers get a heads-up before starting work.
 * Non-blocking — exits 0 regardless so it never prevents dev server from starting.
 */

import { execSync } from 'child_process'

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
