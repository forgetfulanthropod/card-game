// Postgres fully abstracted. This file is kept for backward import compatibility only.
// All data now lives in the JSON file adapter (see server/storage.ts). No DB server required.

export const getDbClient = async () => {
    // intentionally no-op / throw if legacy code path hits it
    throw new Error('getDbClient called but postgres removed. Use storage.ts adapter.')
}

export const sql: any = {
    typeAlias: () => ({}),
    fragment: (s: TemplateStringsArray) => s,
}
