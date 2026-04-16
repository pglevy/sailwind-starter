import type { Entity, CreateInput, UpdateInput } from './types'

export interface Task extends Entity {
  id: number
  title: string
  assignee: string       // username — see src/db/users.ts
  status: string
  priority: string
  category: string
  dueDate: string
  progress: number
  createdBy: string      // username — see src/db/users.ts
  createdOn: string
}

const tasks: Task[] = [
  {
    id: 1,
    title: 'Review Application #1234',
    assignee: 'john.smith',
    status: 'In Progress',
    priority: 'High',
    category: 'Review',
    dueDate: '2026-04-17',
    progress: 65,
    createdBy: 'alice.chen',
    createdOn: '2026-04-10',
  },
  {
    id: 2,
    title: 'Process Document Review',
    assignee: 'john.smith',
    status: 'In Progress',
    priority: 'Normal',
    category: 'Documentation',
    dueDate: '2026-04-20',
    progress: 30,
    createdBy: 'bob.martinez',
    createdOn: '2026-04-08',
  },
  {
    id: 3,
    title: 'Update Vendor Information',
    assignee: 'john.smith',
    status: 'Not Started',
    priority: 'Low',
    category: 'Data Entry',
    dueDate: '2026-04-22',
    progress: 10,
    createdBy: 'carol.white',
    createdOn: '2026-04-05',
  },
]

export async function getTasks(): Promise<Task[]> {
  return tasks
}

export async function getTask(id: number): Promise<Task | undefined> {
  return tasks.find(t => t.id === id)
}

export async function createTask(data: CreateInput<Task>): Promise<Task> {
  const newTask: Task = { ...data, id: Math.max(0, ...tasks.map(t => t.id)) + 1 }
  tasks.push(newTask)
  return newTask
}

export async function updateTask(id: number, data: UpdateInput<Task>): Promise<Task | undefined> {
  const idx = tasks.findIndex(t => t.id === id)
  if (idx === -1) return undefined
  tasks[idx] = { ...tasks[idx], ...data }
  return tasks[idx]
}
