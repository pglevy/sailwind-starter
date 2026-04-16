import type { Entity, CreateInput, UpdateInput } from './types'

export interface Application extends Entity {
  id: number
  applicantName: string
  applicationDate: string
  status: string
  currentStep: number
  createdBy: string      // username — see src/db/users.ts
  createdOn: string
}

export const applicationSteps = [
  'Application Submitted',
  'Initial Review',
  'Documentation Verified',
  'Final Approval',
  'Notification Sent',
]

const applications: Application[] = [
  {
    id: 12345,
    applicantName: 'John Smith',
    applicationDate: 'October 1, 2025',
    status: 'Approved',
    currentStep: 3,
    createdBy: 'alice.chen',
    createdOn: '2025-10-01',
  },
]

export async function getApplications(): Promise<Application[]> {
  return applications
}

export async function getApplication(id: number): Promise<Application | undefined> {
  return applications.find(a => a.id === id)
}

export async function createApplication(data: CreateInput<Application>): Promise<Application> {
  const newApp: Application = { ...data, id: Math.max(0, ...applications.map(a => a.id)) + 1 }
  applications.push(newApp)
  return newApp
}

export async function updateApplication(id: number, data: UpdateInput<Application>): Promise<Application | undefined> {
  const idx = applications.findIndex(a => a.id === id)
  if (idx === -1) return undefined
  applications[idx] = { ...applications[idx], ...data }
  return applications[idx]
}
