import type { RODatum } from 'datums'
import { sortBy, uniq } from 'lodash'
import type { DisplayObject, IDestroyOptions } from 'pixi.js'
import { Ticker } from 'pixi.js'
import type { PixiContainer } from './aliases'
import { applyDisplayObjectArgs } from './_applyArgs'
import type { ContainerArgs, DisplayObjectArgs } from './_types'
import { onDestroyed } from './convenience'
import { Container } from './core'
import { getPixiApp } from './application'

const controlFlow = null
export function If(
    condition: RODatum<boolean>,
    ifRender: () => DisplayObject,
    elseRender?: () => DisplayObject,
    displayArgs?: DisplayObjectArgs,
    destroyOptions: IDestroyOptions | boolean | undefined = { children: true }
): PixiContainer {
    const root = Container({ children: [] })
    onDestroyed(root, condition.onChange(handleChange, true))
    if (displayArgs != null) applyDisplayObjectArgs(root, displayArgs)
    return root
    function handleChange(val: boolean) {
        ;[...root.children].forEach(c => c.destroy(destroyOptions))
        root.removeChildren()
        if (val) {
            root.addChild(ifRender())
        } else if (elseRender != null) {
            root.addChild(elseRender())
        }
    }
}
// export function BareIf<T extends PixiDisplayObject>(
//     condition: RODatum<boolean>,
//     ifRender: () => T,
//     elseRender?: () => T,
//     destroyOptions: IDestroyOptions | boolean | undefined = { children: true }
// ): T {
//     // condition.onChange()
//     return root
//     function handleChange(val: boolean) {
//         root.children.forEach(c => c.destroy(destroyOptions))
//         root.removeChildren()
//         if (val) {
//             root.addChild(ifRender())
//         } else if (elseRender != null) {
//             root.addChild(elseRender())
//         }
//     }
// }
type KeyedDisplayObject = DisplayObject & { key: string | number }
interface KeyedContainer extends PixiContainer {
    children: KeyedDisplayObject[]
}
// TODO: accept array of strings or numbers
export function For<T extends { key: string | number }[] | (string | number)[]>(
    items: RODatum<T>,
    render: (item: T[number]) => DisplayObject,
    position?: (index: number) => { x?: number; y?: number },
    displayArgs?: ContainerArgs,
    destroyOptions: IDestroyOptions | boolean | undefined = { children: true }
): PixiContainer {
    const root = Container({ children: [] }) as KeyedContainer
    onDestroyed(root, items.onChange(handleUpdate, true))

    if (displayArgs != null) applyDisplayObjectArgs(root, displayArgs)

    let warnedAlready = false
    return root

    function handleUpdate(items: T) {
        const hasKey = isKeyedArray(items)
        const keys = hasKey
            ? items.map(v => v.key)
            : (items as (string | number)[])
        if (
            uniq<string | number>(keys).length !== keys.length &&
            !warnedAlready
        ) {
            console.warn('duplicate keys in For:', duplicated(keys))
            warnedAlready = true
        }

        ;[...root.children].forEach(c => {
            if (!keys.includes(c.key)) {
                c.destroy(destroyOptions)
                root.removeChild(c)
            }
        })
        const oldChildren = root.children.filter(c => keys.includes(c.key))
        const oldKeys = oldChildren.map(c => c.key)
        const newItems = hasKey
            ? items.filter(v => !oldKeys.includes(v.key))
            : items.filter(k => !oldKeys.includes(k))
        const newChildren = newItems.map(it => {
            const c = render(it) as KeyedDisplayObject
            c.key = typeof it === 'object' ? it.key : it
            return c
        })
        // redundant filter is necessary because children doesn't necessarily update immediately
        root.removeChildren()
        const sortedChildren = sortBy([...newChildren, ...oldChildren], x =>
            keys.indexOf(x.key)
        )
        if (sortedChildren.length > 0) root.addChild(...sortedChildren)
        if (position != null) {
            for (let i = 0; i < root.children.length; i++) {
                const c = root.children[i]
                const { x, y } = position(i)
                if (x != null) c.x = x
                if (y != null) c.y = y
            }
        }
    }
}
function duplicated<T>(arr: T[]): T[] {
    const seen = new Set<T>()
    const dups = new Set<T>()
    arr.forEach(x => {
        if (seen.has(x)) dups.add(x)
        seen.add(x)
        return false
    })
    return Array.from(dups)
}
function isKeyedArray(
    arr: { key: string | number }[] | (string | number)[]
): arr is { key: string | number }[] {
    return typeof arr[0] === 'object'
}
export function portalize(args: {
    from: DisplayObject
    content: DisplayObject
    to?: () => PixiContainer | PixiContainer
    /** Name of child of `to` to insert child before */
    before?: string
    nextFrame?: boolean
}): void {
    const { from, content, before } = args
    const to_ =
        args.to ?? getPixiApp()?.stage ?? throwNull('app.stage and args.to')
    function attach() {
        const to = typeof to_ === 'function' ? to_() : to_
        if (before != null) {
            const i = to.children.findIndex(c => c.name === before)
            const j = i === -1 ? to.children.length : i
            to.addChildAt(content, j)
        } else {
            to.addChild(content)
        }
        from.on('destroyed', () => {
            to.removeChild(content)
            content.destroy({ children: true })
        })
    }
    if (args.nextFrame) {
        Ticker.shared.addOnce(() => attach())
        // setTimeout(attach, 0)
    } else {
        attach()
    }
}
