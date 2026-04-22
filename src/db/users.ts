/**
 * Mock users for prototyping.
 *
 * In Appian, User is a built-in system record type — you don't create it.
 * Custom record types form MANY_TO_ONE relationships to it.
 *
 * User-reference fields in entity modules (like `assignee`, `createdBy`)
 * store a username string. Use the usernames below as values in seed data.
 */

export interface MockUser {
  username: string
  displayName: string
  initials: string
}

export const mockUsers: MockUser[] = [
  { username: 'john.smith', displayName: 'John Smith', initials: 'JS' },
  { username: 'alice.chen', displayName: 'Alice Chen', initials: 'AC' },
  { username: 'bob.martinez', displayName: 'Bob Martinez', initials: 'BM' },
  { username: 'carol.white', displayName: 'Carol White', initials: 'CW' },
  { username: 'david.kim', displayName: 'David Kim', initials: 'DK' },
]

/** Look up a display name from a username */
export function getDisplayName(username: string): string {
  const user = mockUsers.find(u => u.username === username)
  return user?.displayName ?? username
}

/** Look up initials from a username */
export function getInitials(username: string): string {
  const user = mockUsers.find(u => u.username === username)
  return user?.initials ?? username.slice(0, 2).toUpperCase()
}
