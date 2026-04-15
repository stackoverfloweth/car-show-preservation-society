/**
 * Schema barrel file.
 *
 * Organization:
 *  - Each table lives in its own file (e.g., `users.ts`, `clubs.ts`) and is
 *    re-exported from here alphabetically to minimize merge conflicts.
 *  - Relational-query configuration lives in `../relations.ts` once tables
 *    are introduced.
 *  - Inferred types (e.g., `InferSelectModel<typeof users>`) should be
 *    exported from `packages/shared` for cross-package consumption.
 */
export * from './users';
