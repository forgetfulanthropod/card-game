import { config as loadDotEnv } from 'dotenv'

// @index('./*.ts', f => `export * from '${f.path}'`)
export * from './rand'
export * from './rulebookUtil'
export * from './treeHelpers'
// @endindex

loadDotEnv()

export const isProduction = process.env.IS_PRODUCTION !== 'false'
