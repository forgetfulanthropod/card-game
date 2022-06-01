import type { BattleCursor, Cards } from 'shared'
// dwindle, momentary, convalesce,

export function clearRoomCardModifiers(scene: BattleCursor): void {
    scene.apply(
        'cards',
        (piles): Cards => ({
            ...piles,
            removedRoom: {},
            draw: { ...piles.draw, ...piles.removedRoom },
        })
    )
}
