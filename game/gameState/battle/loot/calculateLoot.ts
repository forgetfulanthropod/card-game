import type { BattleCursor } from 'shared'
import type { LootFromGame } from 'shared'

import { vals } from 'shared/code'

/**
 *
 * @param scene
 * @param source - Determines which calculation to use
 * @returns How much loot is available to claim.
 */
export function calculateLoot(
    scene: BattleCursor,
    source: 'room' | 'dungeon'
): LootFromGame {
    const placeholderEquipment = ['Helmet', 'Sword', 'Cool Thing']
    // TODO: Use scene and source to determine actual loot values
    const getRandomAmount = () => parseInt((Math.random() * 100).toFixed(0))
    const gems = 0
    const tokenTBD = 0
    const fishStick = getRandomAmount()
    const potion = getRandomAmount()
    const swordShield = getRandomAmount()
    const bread = getRandomAmount()

    const placeholder =
        placeholderEquipment[
            Math.ceil(Math.random() * (placeholderEquipment.length - 1))
        ]

    return {
        draftCard: 1,
        gems,
        tokenTBD,
        fishStick,
        potion,
        swordShield,
        bread,
    }
}
