import { getGameStateCursor } from '@/util'

export function claimLoot(username: string): void {
    getGameStateCursor(username)
        .apply('coin', coin => {
            return coin + 10
        })
}
