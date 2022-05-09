// Minecraft Crafting Table by 101Computing
// http://www.101computing.net/minecraft-crafting-table/

// List of items in minecraft - http://minecraft-ids.grahamedgecombe.com/
// List of recipes in minecraft -   https://www.minecraftcraftingguide.net/

import { range } from 'lodash'
import { Fragment } from 'preact'
import { useState } from 'preact/hooks'

import { initialInventory } from './data'
import { clickTableCell, doCraft } from './logic'
import s from './style.module.css'

export type PSet<T> = (cb: T | ((old: T) => T)) => void

const instructions =
    'Click on an ingredient from your inventory, then click on a cell of your crafting table to place this ingredient.'

export default function Minecrafter(): JSXElement {
    const [inventory, setInventory] = useState(initialInventory)
    const [result, setResult] = useState<null | [string, number]>(null)
    const [selected, setSelected] = useState(inventory[0])
    return <div class={s.cssFullReset}>
        <div class={s.screen}>
            <CraftingTable setResult={setResult} selected={selected} />
            <div class={s.arrow}>{'➔'}</div>
            <Result {...{ result, inventory, setInventory }} />
            <Inventory {...{ inventory, setSelected, selected }} />
        </div>
    </div>
}

function CraftingTable(props: {
    selected: number
    setResult: PSet<[string, number] | null>
}) {
    const [craftTable, setCraftTable] = useState(range(9).map(() => 0))
    return <>
        <h1>Crafting Table</h1>
        <div class={s.grid}>
            {range(9).map(i => <div
                class={s.gridCell}
                onClick={() =>
                    clickTableCell(
                        i,
                        props.selected,
                        setCraftTable,
                        props.setResult
                    )
                }
                key={i}
            >
                <img src={imageOf(craftTable[i])} />
            </div>)}
        </div>
    </>
}

function Result(props: {
    result: [string, number] | null
    inventory: number[]
    setInventory: PSet<number[]>
}) {
    return <div
        class={s.result}
        onClick={() =>
            doCraft(props.result?.[1] ?? 0, props.inventory, props.setInventory)
        }
    >
        {props.result != null && <>
            <img src={imageOf(props.result[1])} />
            <br />
            {props.result[0]}
            <br />
            Click on this item to add it to your inventory.
        </>}
    </div>
}

const Inventory = (props: {
    inventory: number[]
    setSelected: PSet<number>
    selected: number
}): JSXElement => <>
    <h1>Inventory</h1>
    <p>{instructions}</p>
    <div class={s.inventory}>
        {range(27).map(i =>
            props.inventory[i] === 0 ? (
                <div class={s.gridCell} key={i}></div>
            ) : (
                <div
                    class={s.gridCell}
                    onClick={() => props.setSelected(props.inventory[i])}
                    style={{
                        backgroundColor:
                            props.selected === props.inventory[i]
                                ? '#88FF88'
                                : '#8b8b8b',
                    }}
                    key={i}
                >
                    <img src={imageOf(props.inventory[i])} />
                    {/* alt={alt} */}
                </div>
            )
        )}
    </div>
</>

function imageOf(id: number): string {
    return `http://www.101computing.net/mc/${id}-0.png`
}
