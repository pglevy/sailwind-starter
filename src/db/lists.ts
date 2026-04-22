/**
 * Board lists (columns) — e.g., "To Do", "In Progress", "Done".
 * Each list has a position for ordering on the board.
 */

import { apiBase, buildHeaders, isConnected } from './api-config'

export interface BoardList {
  id: number
  name: string
  position: number
  createdBy: string
  createdOn: string
  modifiedBy: string
  modifiedOn: string
}

const mockLists: BoardList[] = [
  { id: 1, name: 'Backlog',       position: 1, createdBy: 'alice.chen',   createdOn: '2026-04-01', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-01' },
  { id: 2, name: 'To Do',         position: 2, createdBy: 'alice.chen',   createdOn: '2026-04-01', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-01' },
  { id: 3, name: 'In Progress',   position: 3, createdBy: 'alice.chen',   createdOn: '2026-04-01', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-01' },
  { id: 4, name: 'Done',          position: 4, createdBy: 'alice.chen',   createdOn: '2026-04-01', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-01' },
]

export async function getLists(): Promise<BoardList[]> {
  if (!isConnected()) return [...mockLists].sort((a, b) => a.position - b.position)
  const res = await fetch(`${apiBase}/lists`, { headers: buildHeaders() })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data: BoardList[] = await res.json()
  return data.sort((a, b) => a.position - b.position)
}

export async function getList(id: number): Promise<BoardList | undefined> {
  if (!isConnected()) return mockLists.find(l => l.id === id)
  const all = await getLists()
  return all.find(l => l.id === id)
}

export async function createList(data: Omit<BoardList, 'id'>): Promise<BoardList> {
  if (!isConnected()) {
    const newList: BoardList = { ...data, id: Math.max(0, ...mockLists.map(l => l.id)) + 1 }
    mockLists.push(newList)
    return newList
  }
  const res = await fetch(`${apiBase}/writeList`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify(data) })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const records = await res.json()
  return Array.isArray(records) ? records[0] : records
}

export async function updateList(id: number, data: Partial<BoardList>): Promise<BoardList | undefined> {
  if (!isConnected()) {
    const idx = mockLists.findIndex(l => l.id === id)
    if (idx === -1) return undefined
    mockLists[idx] = { ...mockLists[idx], ...data }
    return mockLists[idx]
  }
  const res = await fetch(`${apiBase}/writeList`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify({ id, ...data }) })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const records = await res.json()
  return Array.isArray(records) ? records[0] : records
}
