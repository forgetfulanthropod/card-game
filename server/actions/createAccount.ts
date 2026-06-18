import type { ServerActions } from 'shared'
import { createAccount } from '@/storage'

export const createAccountAction: ServerActions['createAccount'] = async ({ username, overwrite }) => {
  const res = createAccount(username, !!overwrite)
  if (!res.success) {
    return { result: 'failure', error: res.error }
  }
  return { result: 'success', userId: res.userId, username: res.username }
}
