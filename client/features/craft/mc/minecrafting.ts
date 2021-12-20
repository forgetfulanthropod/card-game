import type { Recipe } from './data'
import { initialInventory, recipes } from './data'

export const nothing = null

const inventory = initialInventory.slice()
const craftTable = [0, 0, 0, 0, 0, 0, 0, 0, 0]
let selectedCell: HTMLElement
let selectedIngredient = 0
let newItem = 0

//Add newly crafted item to the inventory (if it's not already there)
export function addItemToInventory(): void {
    let inventoryIsFull = true
    if (newItem !== 0) {
        //First check if this item is not already in the inventory
        if (inventory.indexOf(newItem) === -1) {
            //Then find an empty location in the inventory
            for (let i = 0; i < inventory.length; i++) {
                if (inventory[i] === 0) {
                    //Empty location spotted. Add item to the inventory
                    inventoryIsFull = false
                    inventory[i] = newItem
                    const elm = document.getElementById('inventory-' + i)
                    if (elm == null) {
                        throw Error('null elm')
                    }
                    elm.innerHTML = "<IMG src='http://www.101computing.net/mc/" + +newItem + "-0.png'>"
                    break
                }
            }
            if (inventoryIsFull) alert('Inventory is full!')
        } else {
            alert('This item is already in your inventory!')
        }
    }
}

//A function to compare a recipe with the content of the craft table
function checkRecipe(recipe: Recipe[2]) {
    let match = true
    for (let i = 0; i < 9; i++) {
        if (recipe[i] !== craftTable[i]) {
            match = false
            break
        }
    }
    return match
}

//A function to compare the craft table with all recipes to see if an item can be crafted
function craft() {
    //Check each recipe one at a time
    const elm = document.getElementById('result')
    if (elm == null) throw Error('null elm')
    elm.innerHTML = ''
    newItem = 0
    for (let i = 0; i < recipes.length; i++) {
        if (checkRecipe(recipes[i][2])) {
            newItem = recipes[i][1]
            //Craft the new item!
            elm.innerHTML =
                "<IMG src='http://www.101computing.net/mc/" +
                +recipes[i][1] +
                "-0.png'><br/>" +
                recipes[i][0] +
                '<BR/>Click on this item to add it to your inventory.'
            break
        }
    }
}

//Highlight inventory item when user click on it
export function selectInventoryItem(cell_ID: number): void {
    if (selectedCell) {
        selectedCell.style.backgroundColor = '#8b8b8b'
    }
    const elm = document.getElementById('inventory-' + cell_ID)
    if (elm == null) throw Error('null elm')
    selectedCell = elm
    selectedCell.style.backgroundColor = '#88FF88'
    selectedIngredient = inventory[cell_ID]
}

//Replace ingredient on craft table when the user click on one of the 9 cells of the craft table
export function selectCraftTable(cell_ID: number): void {
    const craftTableCell = document.getElementById('craftTable-' + cell_ID)
    if (craftTableCell == null) throw Error('null elm')
    if (craftTableCell.innerHTML === '') {
        if (selectedCell) {
            craftTableCell.innerHTML = selectedCell.innerHTML
            craftTable[cell_ID] = selectedIngredient
        }
    } else {
        craftTableCell.innerHTML = ''
        craftTable[cell_ID] = 0
    }
    craft()
}
