import type { Entity, CreateInput, UpdateInput } from './types'

export interface Document extends Entity {
  id: number
  title: string
  submittedBy: string    // username — see src/db/users.ts
  submissionDate: string
  status: string
  recommendation: string | null
  comments: string | null
  createdBy: string      // username — see src/db/users.ts
  createdOn: string
}

export const reviewChecklist = [
  { label: 'Document is complete and all required sections are filled', value: 'complete' },
  { label: 'Information provided is accurate and up-to-date', value: 'accurate' },
  { label: 'Document follows standard formatting guidelines', value: 'formatted' },
  { label: 'No sensitive information is improperly disclosed', value: 'secure' },
]

const documents: Document[] = [
  {
    id: 1,
    title: 'Policy Update Proposal - 2025',
    submittedBy: 'carol.white',
    submissionDate: 'October 20, 2025',
    status: 'Pending Review',
    recommendation: null,
    comments: null,
    createdBy: 'carol.white',
    createdOn: '2025-10-20',
  },
]

export async function getDocuments(): Promise<Document[]> {
  return documents
}

export async function getDocument(id: number): Promise<Document | undefined> {
  return documents.find(d => d.id === id)
}

export async function createDocument(data: CreateInput<Document>): Promise<Document> {
  const newDoc: Document = { ...data, id: Math.max(0, ...documents.map(d => d.id)) + 1 }
  documents.push(newDoc)
  return newDoc
}

export async function updateDocument(id: number, data: UpdateInput<Document>): Promise<Document | undefined> {
  const idx = documents.findIndex(d => d.id === id)
  if (idx === -1) return undefined
  documents[idx] = { ...documents[idx], ...data }
  return documents[idx]
}
