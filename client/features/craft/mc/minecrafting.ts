import { isEqual } from 'lodash'

import { recipes } from './data'
import type { PSetter } from './Minecrafter'

/** Add newly crafted item to the inventory (if it's not already there) */
export function addItemToInventory(newItem: number, inventory: number[], setInventory: PSetter<number[]>): void {
    if (newItem === 0) return
    if (inventory.indexOf(newItem) !== -1) {
        alert('This item is already in your inventory!')
        return
    }
    const i = inventory.indexOf(0)
    if (i === -1) {
        alert('Inventory is full!')
        return
    }
    setInventory(inv => {
        const A = inv.slice()
        A[i] = newItem
        return A
    })
}

/** compare the craft table with all recipes to see if an item can be crafted */
function craft(craftTable: number[], setResult: PSetter<null | [string, number]>) {
    const i = recipes.findIndex(recipe => isEqual(recipe[2], craftTable))
    if (i === -1) {
        setResult(null)
        return
    }
    setResult([recipes[i][0], recipes[i][1]])
}

/** Replace ingredient on craft table when the user click on one of the 9 cells of the craft table */
export function selectCraftTable(
    craftTable: number[],
    cell_ID: number,
    selectedIngredient: number,
    setCraftTable: PSetter<number[]>,
    setResult: PSetter<null | [string, number]>
): void {
    setCraftTable(ct => {
        const A = ct.slice()
        A[cell_ID] = A[cell_ID] === 0 ? selectedIngredient : 0
        return A
    })
    craftTable[cell_ID] = selectedIngredient
    craft(craftTable, setResult)
}
