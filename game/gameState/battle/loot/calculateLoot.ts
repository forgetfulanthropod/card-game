import { entries, shuffle } from 'lodash'
import type { BattleCursor, ClaimableLoot, LootItem } from 'shared'

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
    // TODO: Use scene and source to determine actual loot values
    const getRandomAmount = () => parseInt((Math.random() * 100).toFixed(0))

    const fish = getRandomAmount()
    const copper = getRandomAmount()
    const stone = getRandomAmount()
    const gold = getRandomAmount()
    const wood = getRandomAmount()
    const items = { fish, copper, stone, gold, wood }

    const shuffledLootItems = shuffle(entries(items))
        .filter(lootItem => {
            const [name, count] = lootItem
            return count > 0
        })
        .map(lootItem => {
            const [name, count] = lootItem
            return { name, count } as LootItem
        })

    shuffledLootItems.unshift({ name: 'draftCard', count: 1 })
    shuffledLootItems.push({ name: 'treasureChest', count: 1 })

    return shuffledLootItems
}
