import { isEqual } from 'lodash'

import { initialInventory, recipes } from './data'
import type { PSetter } from './Minecrafter'

const inventory = initialInventory.slice()
const craftTable = [0, 0, 0, 0, 0, 0, 0, 0, 0]
let selectedIngredient = 0
let newItem = 0

//@ts-ignore
window.inventory = inventory
//@ts-ignore
window.selectedIngredient = selectedIngredient

//@ts-ignore
window.craftTable = craftTable

/** Add newly crafted item to the inventory (if it's not already there) */
export function addItemToInventory(uiInventory: number[], setInventory: PSetter<number[]>): void {
    if (newItem === 0) return
    if (uiInventory.indexOf(newItem) !== -1) {
        alert('This item is already in your inventory!')
        return
    }
    const i = uiInventory.indexOf(0)
    if (i === -1) {
        alert('Inventory is full!')
        return
    }
    setInventory(inv => {
        const A = inv.slice()
        A[i] = newItem
        return A
    })
    uiInventory[i] = newItem
    inventory[i] = newItem
}

/** compare the craft table with all recipes to see if an item can be crafted */
function craft(setResult: PSetter<null | [string, number]>) {
    const i = recipes.findIndex(recipe => isEqual(recipe[2], craftTable))
    // debugger
    if (i === -1) {
        setResult(null)
        return
    }
    newItem = recipes[i][1]
    setResult([recipes[i][0], recipes[i][1]])
}

/** Highlight inventory item when user click on it */
export function selectInventoryItem(cell_ID: number, setSelected: PSetter<number>): void {
    setSelected(cell_ID)
    selectedIngredient = inventory[cell_ID]
}

/** Replace ingredient on craft table when the user click on one of the 9 cells of the craft table */
export function selectCraftTable(
    cell_ID: number,
    setCraftTable: PSetter<number[]>,
    setResult: PSetter<null | [string, number]>
): void {
    setCraftTable(ct => {
        const A = ct.slice()
        A[cell_ID] = A[cell_ID] === 0 ? selectedIngredient : 0
        return A
    })
    craftTable[cell_ID] = selectedIngredient
    craft(setResult)
}
