/**
 * Card tasks — checklist items within a card.
 * Each task belongs to a card via cardId.
 */

import { apiBase, buildHeaders, isConnected } from './api-config'

export interface Task {
  id: number
  title: string
  isDone: boolean
  cardId: number       // FK → Card.id
  createdBy: string
  createdOn: string
  modifiedBy: string
  modifiedOn: string
}

const mockTasks: Task[] = [
  { id: 1,  title: 'Identify key stakeholders',       isDone: true,  cardId: 1, createdBy: 'alice.chen',   createdOn: '2026-04-02', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-05' },
  { id: 2,  title: 'Draft project charter',           isDone: true,  cardId: 1, createdBy: 'alice.chen',   createdOn: '2026-04-02', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-06' },
  { id: 3,  title: 'Get sign-off from sponsor',       isDone: true,  cardId: 1, createdBy: 'alice.chen',   createdOn: '2026-04-02', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-10' },
  { id: 4,  title: 'Inventory all components',         isDone: true,  cardId: 2, createdBy: 'bob.martinez', createdOn: '2026-04-03', modifiedBy: 'bob.martinez', modifiedOn: '2026-04-08' },
  { id: 5,  title: 'Document inconsistencies',         isDone: false, cardId: 2, createdBy: 'bob.martinez', createdOn: '2026-04-03', modifiedBy: 'bob.martinez', modifiedOn: '2026-04-12' },
  { id: 6,  title: 'Propose updated tokens',           isDone: false, cardId: 2, createdBy: 'bob.martinez', createdOn: '2026-04-03', modifiedBy: 'bob.martinez', modifiedOn: '2026-04-12' },
  { id: 7,  title: 'Tag interview transcripts',        isDone: true,  cardId: 3, createdBy: 'carol.white',  createdOn: '2026-04-04', modifiedBy: 'carol.white',  modifiedOn: '2026-04-09' },
  { id: 8,  title: 'Create affinity map',              isDone: false, cardId: 3, createdBy: 'carol.white',  createdOn: '2026-04-04', modifiedBy: 'carol.white',  modifiedOn: '2026-04-11' },
  { id: 9,  title: 'Write summary report',             isDone: false, cardId: 3, createdBy: 'carol.white',  createdOn: '2026-04-04', modifiedBy: 'carol.white',  modifiedOn: '2026-04-11' },
  { id: 10, title: 'Compare fields to schema',         isDone: false, cardId: 4, createdBy: 'david.kim',    createdOn: '2026-04-05', modifiedBy: 'david.kim',    modifiedOn: '2026-04-09' },
  { id: 11, title: 'Validate endpoint aliases',        isDone: false, cardId: 4, createdBy: 'david.kim',    createdOn: '2026-04-05', modifiedBy: 'david.kim',    modifiedOn: '2026-04-09' },
  { id: 12, title: 'Wireframe step 1: welcome',        isDone: false, cardId: 5, createdBy: 'alice.chen',   createdOn: '2026-04-06', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-08' },
  { id: 13, title: 'Wireframe step 2: profile setup',  isDone: false, cardId: 5, createdBy: 'alice.chen',   createdOn: '2026-04-06', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-08' },
  { id: 14, title: 'Create demo script',               isDone: true,  cardId: 9, createdBy: 'alice.chen',   createdOn: '2026-04-03', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-12' },
  { id: 15, title: 'Build slide deck',                 isDone: true,  cardId: 9, createdBy: 'alice.chen',   createdOn: '2026-04-03', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-13' },
  { id: 16, title: 'Rehearse with team',               isDone: true,  cardId: 9, createdBy: 'alice.chen',   createdOn: '2026-04-03', modifiedBy: 'alice.chen',   modifiedOn: '2026-04-14' },
]

export async function getTasks(): Promise<Task[]> {
  if (!isConnected()) return [...mockTasks]
  const res = await fetch(`${apiBase}/tasks`, { headers: buildHeaders() })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function getTask(id: number): Promise<Task | undefined> {
  if (!isConnected()) return mockTasks.find(t => t.id === id)
  const all = await getTasks()
  return all.find(t => t.id === id)
}

export async function createTask(data: Omit<Task, 'id'>): Promise<Task> {
  if (!isConnected()) {
    const newTask: Task = { ...data, id: Math.max(0, ...mockTasks.map(t => t.id)) + 1 }
    mockTasks.push(newTask)
    return newTask
  }
  const res = await fetch(`${apiBase}/writeTask`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify(data) })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const records = await res.json()
  return Array.isArray(records) ? records[0] : records
}

export async function updateTask(id: number, data: Partial<Task>): Promise<Task | undefined> {
  if (!isConnected()) {
    const idx = mockTasks.findIndex(t => t.id === id)
    if (idx === -1) return undefined
    mockTasks[idx] = { ...mockTasks[idx], ...data }
    return mockTasks[idx]
  }
  const res = await fetch(`${apiBase}/writeTask`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify({ id, ...data }) })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const records = await res.json()
  return Array.isArray(records) ? records[0] : records
}

export async function deleteTask(id: number): Promise<boolean> {
  if (!isConnected()) {
    const idx = mockTasks.findIndex(t => t.id === id)
    if (idx === -1) return false
    mockTasks.splice(idx, 1)
    return true
  }
  const res = await fetch(`${apiBase}/deleteTask`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify({ id }) })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return true
}
