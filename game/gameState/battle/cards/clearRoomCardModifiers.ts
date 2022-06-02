import type { BattleCursor, Piles } from 'shared'
// dwindle, momentary, convalesce,

export function clearRoomCardModifiers(scene: BattleCursor): void {
    scene.apply(
        'cards',
        (piles): Piles => ({
            ...piles,
            removedRoom: {},
            draw: { ...piles.draw, ...piles.removedRoom },
        })
    )
}
