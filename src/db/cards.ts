/**
 * Board cards — the main work items on the kanban board.
 * Each card belongs to a list (column) via listId.
 */

import { apiBase, buildHeaders, isConnected } from './api-config'

export interface Card {
  id: number
  name: string
  description: string
  listId: number       // FK → BoardList.id
  isPriority: boolean
  createdBy: string
  createdOn: string
  modifiedBy: string
  modifiedOn: string
}

const mockCards: Card[] = [
  { id: 1,  name: 'Define project scope',         description: 'Document goals, deliverables, and timeline for the Q3 initiative.',                listId: 4, isPriority: false, createdBy: 'alice.chen',    createdOn: '2026-04-02', modifiedBy: 'alice.chen',    modifiedOn: '2026-04-10' },
  { id: 2,  name: 'Design system audit',           description: 'Review current component library for consistency gaps.',                           listId: 3, isPriority: true,  createdBy: 'bob.martinez',  createdOn: '2026-04-03', modifiedBy: 'bob.martinez',  modifiedOn: '2026-04-12' },
  { id: 3,  name: 'User interview synthesis',       description: 'Compile findings from the 12 user interviews into themes.',                       listId: 3, isPriority: false, createdBy: 'carol.white',   createdOn: '2026-04-04', modifiedBy: 'carol.white',   modifiedOn: '2026-04-11' },
  { id: 4,  name: 'API contract review',            description: 'Validate the generated API contract against Appian record types.',                listId: 2, isPriority: true,  createdBy: 'david.kim',     createdOn: '2026-04-05', modifiedBy: 'david.kim',     modifiedOn: '2026-04-09' },
  { id: 5,  name: 'Onboarding flow prototype',      description: 'Build a clickable prototype for the new employee onboarding experience.',         listId: 2, isPriority: false, createdBy: 'alice.chen',    createdOn: '2026-04-06', modifiedBy: 'alice.chen',    modifiedOn: '2026-04-08' },
  { id: 6,  name: 'Performance benchmarks',         description: 'Run load tests on the web API endpoints and document results.',                   listId: 1, isPriority: false, createdBy: 'bob.martinez',  createdOn: '2026-04-07', modifiedBy: 'bob.martinez',  modifiedOn: '2026-04-07' },
  { id: 7,  name: 'Accessibility compliance check', description: 'Audit all prototype pages against WCAG 2.1 AA guidelines.',                      listId: 1, isPriority: true,  createdBy: 'carol.white',   createdOn: '2026-04-08', modifiedBy: 'carol.white',   modifiedOn: '2026-04-08' },
  { id: 8,  name: 'Data migration plan',            description: 'Draft the strategy for migrating legacy records into the new data model.',        listId: 1, isPriority: false, createdBy: 'david.kim',     createdOn: '2026-04-09', modifiedBy: 'david.kim',     modifiedOn: '2026-04-09' },
  { id: 9,  name: 'Stakeholder demo prep',          description: 'Prepare slide deck and live demo for the executive review.',                      listId: 4, isPriority: false, createdBy: 'alice.chen',    createdOn: '2026-04-03', modifiedBy: 'alice.chen',    modifiedOn: '2026-04-14' },
]

export async function getCards(): Promise<Card[]> {
  if (!isConnected()) return [...mockCards]
  const res = await fetch(`${apiBase}/cards`, { headers: buildHeaders() })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function getCard(id: number): Promise<Card | undefined> {
  if (!isConnected()) return mockCards.find(c => c.id === id)
  const all = await getCards()
  return all.find(c => c.id === id)
}

export async function createCard(data: Omit<Card, 'id'>): Promise<Card> {
  if (!isConnected()) {
    const newCard: Card = { ...data, id: Math.max(0, ...mockCards.map(c => c.id)) + 1 }
    mockCards.push(newCard)
    return newCard
  }
  const res = await fetch(`${apiBase}/writeCard`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify(data) })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const records = await res.json()
  return Array.isArray(records) ? records[0] : records
}

export async function updateCard(id: number, data: Partial<Card>): Promise<Card | undefined> {
  if (!isConnected()) {
    const idx = mockCards.findIndex(c => c.id === id)
    if (idx === -1) return undefined
    mockCards[idx] = { ...mockCards[idx], ...data }
    return mockCards[idx]
  }
  const res = await fetch(`${apiBase}/writeCard`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify({ id, ...data }) })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const records = await res.json()
  return Array.isArray(records) ? records[0] : records
}

export async function deleteCard(id: number): Promise<boolean> {
  if (!isConnected()) {
    const idx = mockCards.findIndex(c => c.id === id)
    if (idx === -1) return false
    mockCards.splice(idx, 1)
    return true
  }
  const res = await fetch(`${apiBase}/deleteCard`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify({ id }) })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return true
}
