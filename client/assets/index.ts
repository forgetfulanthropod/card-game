import { satisfies } from 'shared/code'
import * as assetMaps from './assetMaps'
export * from './assetGetters'
export * from './assetTypes'
export * from './invisibleEffects'
satisfies<Record<string, Record<string, string>>>(assetMaps)
export { assetMaps }
