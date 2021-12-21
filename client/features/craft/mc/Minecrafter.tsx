// Minecraft Crafting Table by 101Computing
// http://www.101computing.net/minecraft-crafting-table/

// List of items in minecraft - http://minecraft-ids.grahamedgecombe.com/
// List of recipes in minecraft -   https://www.minecraftcraftingguide.net/

import { range } from 'lodash'
import { Fragment, h } from 'preact'
import { useState } from 'preact/hooks'

import { pairs } from './data'
import { clickTableCell, doCraft } from './minecrafting'
import s from './style.module.css'

export type PSetter<T> = (cb: T | ((old: T) => T)) => void

const instructions =
    'Click on an ingredient from your inventory, then click on a cell of your crafting table to place this ingredient.'

export default function Minecrafter(): JSX.Element {
    const [inventory, setInventory] = useState(() => {
        const A = range(27).map(() => 0)
        pairs.forEach(([_, x], i) => (A[i] = x))
        return A
    })
    const [result, setResult] = useState<null | [string, number]>(null)
    const [selected, setSelected] = useState(inventory[0])
    const [craftTable, setCraftTable] = useState(range(9).map(() => 0))
    return (
        <div class={s['cssFullReset']}>
            <div class={s['screen']}>
                <h1>Crafting Table</h1>
                <div class={s['grid']}>
                    {range(9).map(i => (
                        <div
                            class={s['gridCell']}
                            onClick={() => clickTableCell(i, selected, setCraftTable, setResult)}
                            key={i}
                        >
                            <img src={imageOf(craftTable[i])} />
                        </div>
                    ))}
                </div>
                <div class={s['arrow']}>{'➔'}</div>
                <div class={s['result']} onClick={() => doCraft(result?.[1] ?? 0, inventory, setInventory)}>
                    {result != null && (
                        <>
                            <img src={imageOf(result[1])} />
                            <br />
                            {result[0]}
                            <br />
                            Click on this item to add it to your inventory.
                        </>
                    )}
                </div>

                <h1>Inventory</h1>
                <p>{instructions}</p>
                <div class={s['inventory']}>
                    {range(27).map(i =>
                        inventory[i] === 0 ? (
                            <div class={s['gridCell']} key={i}></div>
                        ) : (
                            <div
                                class={s['gridCell']}
                                onClick={() => setSelected(inventory[i])}
                                style={{ backgroundColor: selected === inventory[i] ? '#88FF88' : '#8b8b8b' }}
                                key={i}
                            >
                                <img src={imageOf(inventory[i])} />
                                {/* alt={alt} */}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

function imageOf(id: number): string {
    return `http://www.101computing.net/mc/${id}-0.png`
}
