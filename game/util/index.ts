import { config as loadDotEnv } from 'dotenv'
import { getServerEnv } from 'shared/code'

// @index('./*.ts', f => `export * from '${f.path}'`)
export * from './rand'
export * from './rulebookUtil'
export * from './treeHelpers'
// @endindex


export const isProduction = getServerEnv('IS_PRODUCTION') === 'true'
