import type { BattleCursor, ClaimableLoot } from 'shared'

/**
 *
 * @param scene
 * @param source - Determines which calculation to use
 * @returns How much loot is available to claim.
 */
export function calculateLoot(
    scene: BattleCursor,
    source: 'room' | 'dungeon'
): ClaimableLoot {
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

    return [
        { name: 'draftCard', count: 1 },
        { name: 'fishStick', count: fishStick },
        { name: 'potion', count: potion },
        { name: 'bread', count: bread },
        { name: 'swordShield', count: swordShield },
        { name: 'treasureChest', count: 1 },
    ]
}
