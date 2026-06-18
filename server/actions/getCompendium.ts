import type { ServerActions } from 'shared'
import { getCompendium } from '@/storage'

export const getCompendiumAction: ServerActions['getCompendium'] = async ({ userId }) => {
  return getCompendium(userId)
}
