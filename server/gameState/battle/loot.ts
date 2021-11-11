import { getGameStateCursor } from '@/util'

export function claimLoot(): void {
    getGameStateCursor('alice')
        .apply('coin', coin => {
            return coin + 10
        })
}
