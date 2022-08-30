import type { BattleCursor } from 'shared'
import type { LootEarned, LootFromGame } from 'shared'

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
): LootEarned {
    const placeholderEquipment = ['Helmet', 'Sword', 'Cool Thing']

    // TODO: Use scene and source to determine actual loot values
    const gems = Math.random() * 100
    const tokenTBD = Math.random() * 100
    const placeholder = Math.floor(
        Math.random() * placeholderEquipment.length - 1
    )

    const items: { [key in LootFromGame]: number } = {
        gems,
        tokenTBD,
        placeholder,
    }

    return {
        items,
        claimed: false,
    }
}
