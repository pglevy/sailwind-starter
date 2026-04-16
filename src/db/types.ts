/**
 * Shared type utilities for the data layer.
 *
 * Every entity module in src/db/ should use these helpers
 * to keep the pattern consistent across the prototype.
 */

/** Base interface that all entities extend (every entity has a numeric id) */
export interface Entity {
  id: number
}

/** Helper: strip the `id` field for create operations */
export type CreateInput<T extends Entity> = Omit<T, 'id'>

/** Helper: partial update payload (id is required to identify the record) */
export type UpdateInput<T extends Entity> = Partial<Omit<T, 'id'>>
