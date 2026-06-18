import type { ServerActions } from 'shared'
import { discoverItem } from '@/storage'

export const discoverAction: ServerActions['discover'] = async ({ userId, category, id }) => {
  discoverItem(userId, category as any, id)
  return
}
