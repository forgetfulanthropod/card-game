import type { ServerActions } from 'shared'
import { listAccounts } from '@/storage'

export const listAccountsAction: ServerActions['listAccounts'] = async () => {
  return { accounts: listAccounts() }
}
