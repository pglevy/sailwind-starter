/**
 * Grocery items — each item belongs to a store section (MANY_TO_ONE).
 * `sectionId` is a foreign key reference to sections.ts.
 *
 * When VITE_API_BASE is set, functions call the Appian web APIs.
 * When unset, they fall back to local mock data.
 */

import { apiBase, buildHeaders, isConnected } from './api-config'

export interface GroceryItem {
  id: number
  name: string
  sectionId: number   // FK → Section.id
  quantity: string
  purchased: boolean
  favorite: boolean
}

// --- Mock seed data (used when not connected to Appian) ---

const mockGroceryItems: GroceryItem[] = [
  { id: 1,  name: 'Bananas',          sectionId: 1, quantity: '1 bunch',  purchased: false, favorite: true },
  { id: 2,  name: 'Spinach',          sectionId: 1, quantity: '1 bag',    purchased: false, favorite: false },
  { id: 3,  name: 'Apples',           sectionId: 1, quantity: '6',        purchased: false, favorite: true },
  { id: 4,  name: 'Whole Milk',       sectionId: 2, quantity: '1 gallon', purchased: false, favorite: true },
  { id: 5,  name: 'Eggs',             sectionId: 2, quantity: '1 dozen',  purchased: false, favorite: true },
  { id: 6,  name: 'Cheddar Cheese',   sectionId: 2, quantity: '8 oz',     purchased: false, favorite: false },
  { id: 7,  name: 'Chicken Breast',   sectionId: 3, quantity: '2 lbs',    purchased: false, favorite: false },
  { id: 8,  name: 'Sourdough Bread',  sectionId: 4, quantity: '1 loaf',   purchased: false, favorite: true },
  { id: 9,  name: 'Pasta',            sectionId: 5, quantity: '1 box',    purchased: false, favorite: false },
  { id: 10, name: 'Olive Oil',        sectionId: 5, quantity: '1 bottle', purchased: false, favorite: true },
  { id: 11, name: 'Frozen Peas',      sectionId: 6, quantity: '1 bag',    purchased: false, favorite: false },
  { id: 12, name: 'Orange Juice',     sectionId: 7, quantity: '1 carton', purchased: false, favorite: true },
]

// --- CRUD functions (dual-mode: API when connected, mock when not) ---

export async function getGroceryItems(): Promise<GroceryItem[]> {
  if (!isConnected()) return [...mockGroceryItems]
  const res = await fetch(`${apiBase}/groceryItems`, { headers: buildHeaders() })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function getGroceryItem(id: number): Promise<GroceryItem | undefined> {
  if (!isConnected()) return mockGroceryItems.find(i => i.id === id)
  const all = await getGroceryItems()
  return all.find(i => i.id === id)
}

export async function createGroceryItem(data: Omit<GroceryItem, 'id'>): Promise<GroceryItem> {
  if (!isConnected()) {
    const newItem: GroceryItem = { ...data, id: Math.max(0, ...mockGroceryItems.map(i => i.id)) + 1 }
    mockGroceryItems.push(newItem)
    return newItem
  }
  const res = await fetch(`${apiBase}/writeGroceryItem`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const records = await res.json()
  return Array.isArray(records) ? records[0] : records
}

export async function updateGroceryItem(id: number, data: Partial<GroceryItem>): Promise<GroceryItem | undefined> {
  if (!isConnected()) {
    const idx = mockGroceryItems.findIndex(i => i.id === id)
    if (idx === -1) return undefined
    mockGroceryItems[idx] = { ...mockGroceryItems[idx], ...data }
    return mockGroceryItems[idx]
  }
  const res = await fetch(`${apiBase}/writeGroceryItem`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ id, ...data }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const records = await res.json()
  return Array.isArray(records) ? records[0] : records
}

export async function deleteGroceryItem(id: number): Promise<boolean> {
  if (!isConnected()) {
    const idx = mockGroceryItems.findIndex(i => i.id === id)
    if (idx === -1) return false
    mockGroceryItems.splice(idx, 1)
    return true
  }
  const res = await fetch(`${apiBase}/deleteGroceryItem`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return true
}
