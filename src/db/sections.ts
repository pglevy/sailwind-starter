/**
 * Store sections — the "reference table" that grocery items relate to.
 *
 * When VITE_API_BASE is set, functions call the Appian web APIs.
 * When unset, they fall back to local mock data.
 */

import { apiBase, buildHeaders, isConnected } from './api-config'

export interface Section {
  id: number
  name: string
  sortOrder: number
}

// --- Mock seed data (used when not connected to Appian) ---

const mockSections: Section[] = [
  { id: 1, name: 'Produce', sortOrder: 1 },
  { id: 2, name: 'Dairy & Eggs', sortOrder: 2 },
  { id: 3, name: 'Meat & Seafood', sortOrder: 3 },
  { id: 4, name: 'Bakery & Bread', sortOrder: 4 },
  { id: 5, name: 'Pantry & Dry Goods', sortOrder: 5 },
  { id: 6, name: 'Frozen', sortOrder: 6 },
  { id: 7, name: 'Beverages', sortOrder: 7 },
  { id: 8, name: 'Snacks', sortOrder: 8 },
  { id: 9, name: 'Household', sortOrder: 9 },
]

// --- Read functions (dual-mode: API when connected, mock when not) ---

export async function getSections(): Promise<Section[]> {
  if (!isConnected()) return [...mockSections].sort((a, b) => a.sortOrder - b.sortOrder)
  const res = await fetch(`${apiBase}/sections`, { headers: buildHeaders() })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data: Section[] = await res.json()
  return data.sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getSection(id: number): Promise<Section | undefined> {
  if (!isConnected()) return mockSections.find(s => s.id === id)
  const all = await getSections()
  return all.find(s => s.id === id)
}
