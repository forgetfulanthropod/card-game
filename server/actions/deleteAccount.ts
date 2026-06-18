import type { ServerActions } from 'shared'
import { deleteAccount } from '@/storage'

export const deleteAccountAction: ServerActions['deleteAccount'] = async ({ userId }) => {
  const ok = deleteAccount(userId)
  return { result: ok ? 'success' : 'failure' }
}
