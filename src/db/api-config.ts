/**
 * API configuration for connecting to Appian Web APIs.
 *
 * When VITE_API_BASE is set, entity modules use real fetch calls.
 * When it's empty or unset, they fall back to local mock data.
 *
 * Set in .env.local:
 *   VITE_API_BASE=https://your-env.appiancloud.com/suite/webapi
 *   VITE_API_KEY=your-api-key  (optional, for api_key auth tier)
 */

export const apiBase = import.meta.env.VITE_API_BASE || ''

/** Returns true when a real Appian backend is configured */
export const isConnected = () => !!apiBase

export function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const apiKey = import.meta.env.VITE_API_KEY
  if (apiKey) {
    headers['Appian-API-Key'] = apiKey
  }
  return headers
}
