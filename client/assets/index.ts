import { NestedKeys } from 'shared'
import { satisfies } from 'shared/code'
import * as assetMaps from './assetMaps'
import * as deluxeAssetMaps from './deluxeAssetMaps'
satisfies<AssetMaps>(assetMaps)
satisfies<AssetMaps>(deluxeAssetMaps)

export { assetMaps, deluxeAssetMaps }

export * from './assetGetters'
export * from './assetTypes'
export * from './invisibleEffects'

export type AssetMaps = Record<string, Record<string, string>>

export type AssetKey =
    | NestedKeys<typeof assetMaps>
    | NestedKeys<typeof deluxeAssetMaps>
export type BasicAssetKey = NestedKeys<typeof assetMaps>
export type DeluxeAssetKey = NestedKeys<typeof deluxeAssetMaps>

export * from './assetMaps'
export * from './deluxeAssetMaps'
