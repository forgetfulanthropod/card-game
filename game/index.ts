import { NetworkEvent } from 'shared'
export * as actions from './actions/index'
export { getInitialGameState } from './gameState/index'

type Emit<_A extends string, _B> = (args: {
    username: string
    event: NetworkEvent<_A, _B>
}) => void

let state = {
    emit: (() => {}) as Emit<any, unknown>,
}
