// Minecraft Crafting Table by 101Computing
// http://www.101computing.net/minecraft-crafting-table/

// List of items in minecraft - http://minecraft-ids.grahamedgecombe.com/
// List of recipes in minecraft -   https://www.minecraftcraftingguide.net/

import './style.css'

import { range } from 'lodash'
import { h } from 'preact'

import { pairs } from './data'
import { addItemToInventory, selectCraftTable, selectInventoryItem } from './minecrafting'

export default function Minecrafter(): JSX.Element {
    return (
        <div id="screen">
            <h1>Crafting Table</h1>
            <div id="grid">
                {range(9).map(i => (
                    <div class="gridCell" onClick={() => selectCraftTable(i)} id={`craftTable-${i}`} key={i}></div>
                ))}
            </div>
            <div class="arrow">&#10132;</div>
            <div id="result" onClick={() => addItemToInventory()}></div>

            <h1>Inventory</h1>
            <p>
                Click on an ingredient from your inventory, then click on a cell of your crafting table to place this
                ingredient.
            </p>
            <div id="inventory">
                {pairs.map(([alt, id], index) => (
                    <div
                        class="gridCell"
                        onClick={() => selectInventoryItem(index)}
                        id={`inventory-${index}`}
                        key={index}
                    >
                        <img src={`http://www.101computing.net/mc/${id}-0.png`} alt={alt} />
                    </div>
                ))}
                {range(10, 27).map(i => (
                    <div class="gridCell" key={i} onClick={() => selectInventoryItem(i)} id={`inventory-${i}`}></div>
                ))}
            </div>
        </div>
    )
}
