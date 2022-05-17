import type { NetworkEvent } from 'shared'
export { attachServerMethods } from './util'
export * as actions from './actions/index'
export { getInitialGameState } from './gameState/index'

type Emit<_A extends string, _B> = (args: {
    username: string
    event: NetworkEvent<_A, _B>
}) => void

const state = {
    emit: (() => {}) as Emit<any, unknown>,
}
