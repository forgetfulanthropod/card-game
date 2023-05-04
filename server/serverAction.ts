import * as serverActions from './actions'
import { satisfies } from 'shared/code'
import type { ServerActions } from 'shared'

satisfies<ServerActions>(serverActions)

export function isServerAction(name: string): name is keyof ServerActions {
    return name in serverActions
}
