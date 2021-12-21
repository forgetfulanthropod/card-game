import { isEqual } from 'lodash'

import { recipes } from './data'
import type { PSetter } from './Minecrafter'

export function doCraft(newItem: number, inventory: readonly number[], setInventory: PSetter<number[]>): void {
    if (newItem === 0) return
    if (inventory.includes(newItem)) return
    const emptySlot = inventory.indexOf(0)
    if (emptySlot === -1) return
    setInventory(inv => {
        const a = inv.slice()
        a[emptySlot] = newItem
        return a
    })
}

/** Replace ingredient on craft table when the user click on one of the 9 cells of the craft table */
export function clickTableCell(
    cellIndex: number,
    selectedIngredient: number,
    setCraftTable: PSetter<number[]>,
    setResult: PSetter<null | [string, number]>
): void {
    setCraftTable(ct => {
        const A = ct.slice()
        A[cellIndex] = A[cellIndex] !== selectedIngredient ? selectedIngredient : 0
        findRecipe(A, setResult)
        return A
    })
}

function findRecipe(craftTable: readonly number[], setResult: PSetter<null | [string, number]>) {
    const i = recipes.findIndex(recipe => isEqual(recipe[2], craftTable))
    setResult(i === -1 ? null : [recipes[i][0], recipes[i][1]])
}
