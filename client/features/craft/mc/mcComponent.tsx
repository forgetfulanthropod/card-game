// Minecraft Crafting Table by 101Computing
// http://www.101computing.net/minecraft-crafting-table/

// List of items in minecraft - http://minecraft-ids.grahamedgecombe.com/
// List of recipes in minecraft -   https://www.minecraftcraftingguide.net/

import { range } from 'lodash'
import { h } from 'preact'

import { pairs } from './data'
import { addItemToInventory, selectCraftTable, selectInventoryItem } from './mc'

export default function mcComponent(): JSX.Element {
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
            <h1>
                <br />
                Recipes
            </h1>
            <div id="recipes">
                <p>Wooden Planks:</p>
                <img src="http://www.101computing.net/mc/recipe-wood-plank.png" />
                <p>Sticks:</p>
                <img src="http://www.101computing.net/mc/recipe-stick.png" />
                <p>Chest:</p>
                <img src="http://www.101computing.net/mc/recipe-chest.png" />
                <p>Crafting Table:</p>
                <img src="http://www.101computing.net/mc/recipe-crafting-table.png" />
                <p>Furnace:</p>
                <img src="http://www.101computing.net/mc/recipe-furnace.png" />
                <p>Flint and Steel:</p>
                <img src="http://www.101computing.net/mc/recipe-flint-and-steel.png" />
                <p>Redstone Block:</p>
                <img src="http://www.101computing.net/mc/recipe-redstone-block.png" />
                <p>Swords:</p>
                <img src="http://www.101computing.net/mc/recipe-swords.gif" />
                <p>Fishing Rod:</p>
                <img src="http://www.101computing.net/mc/recipe-fishing-rod.png" />
                <p>Bow:</p>
                <img src="http://www.101computing.net/mc/recipe-bow.png" />
                <p>Arrows:</p>
                <img src="http://www.101computing.net/mc/recipe-arrow.png" />
                <p>Bucket:</p>
                <img src="http://www.101computing.net/mc/recipe-bucket.png" />
                <p>Hoes:</p>
                <img src="http://www.101computing.net/mc/recipe-hoes.gif" />
                <p>Axes:</p>
                <img src="http://www.101computing.net/mc/recipe-axes.gif" />
                <p>Pickaxes:</p>
                <img src="http://www.101computing.net/mc/recipe-pickaxes.gif" />
                <p>Shovels:</p>
                <img src="http://www.101computing.net/mc/recipe-shovels.gif" />
            </div>
        </div>
    )
}
