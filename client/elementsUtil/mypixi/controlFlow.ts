import type { Composed, RODatum } from 'datums'
import { compose } from 'datums'
import { sortBy, uniq } from 'lodash'
import type { DisplayObject, IDestroyOptions } from 'pixi.js'
import { Ticker } from 'pixi.js'
import type { PixiContainer } from './aliases'
import { applyDisplayObjectArgs } from './_applyArgs'
import type { ContainerArgs, DisplayObjectArgs } from './_types'
import { onDestroyed } from './convenience'
import { Container } from './core'
import { getPixiApp } from './application'

type DestroyOptions = IDestroyOptions | boolean | undefined

type Falsy = false | null | 0 | '' | undefined
/** NOTE: condition datum is automatically destroyed if it has .destroy.
 *  Wrap condition with noDestroy() if you don't want this.
 *
 * @param condition: a datum. if the value of condition is truthy, then it is passed to ifRender.
 * @param ifRender: a callback returning a DisplayObject. Called when `condition` is truthy. Takes the current value of `condition`.
 * @param elseRender: a callback returning a DisplayObject. Called when `condition` is falsy. Receives no arguments.
 * @param displayArgs: arguments to _the container containing the DisplayObject returned by ifRender or elseRender_.
 * @param destroyOptions: destroy options for _the children_, not the root.
 */
export function If<T = unknown>(
    condition: RODatum<T> & { destroy?: Callback },
    ifRender: (x: Exclude<T, Falsy>) => DisplayObject,
    elseRender?: () => DisplayObject,
    displayArgs?: DisplayObjectArgs,
    destroyOptions: DestroyOptions = { children: true }
): PixiContainer {
    const root = Container({})
    onDestroyed(
        root,
        condition.onChange(handleChange, true),
        () => condition?.destroy?.(),
    ) // prettier-ignore
    if (displayArgs != null) applyDisplayObjectArgs(root, displayArgs)
    return root
    function handleChange(val: T) {
        ;[...root.children].forEach(c => c.destroy(destroyOptions))
        root.removeChildren()
        //@ts-expect-error
        if (val != null && val !== false) {
            // @ts-expect-error
            root.addChild(ifRender(val))
        } else if (elseRender != null) {
            // @ts-expect-error
            root.addChild(elseRender(val))
        }
    }
}

export function IfHideShow<T = unknown>(
    condition: RODatum<T> & { destroy?: Callback },
    ifEl: DisplayObject,
    elseEl?: DisplayObject,
    displayArgs?: DisplayObjectArgs
): PixiContainer {
    const root = Container({}, ifEl, elseEl ?? null)
    onDestroyed(
        root,
        condition.onChange(handleChange, true),
        () => condition?.destroy?.(),
    ) // prettier-ignore
    if (displayArgs != null) applyDisplayObjectArgs(root, displayArgs)
    return root
    function handleChange(val: T) {
        ifEl.visible = !!val
        if (elseEl) elseEl.visible = !val
    }
}

/** Wraps a cursor with compose so you don't destroy the original */
export function noDestroy<T>(d: RODatum<T> & { destroy: Callback }) {
    const c = compose(([d]) => d, d)
    // @ts-expect-error
    c.destroy = c.unsub
    return c as Composed<T, [RODatum<T>]> & { destroy: Callback }
}

// export function BareIf<T extends PixiDisplayObject>(
//     condition: RODatum<boolean>,
//     ifRender: () => T,
//     elseRender?: () => T,
//     destroyOptions: DestroyOptions = { children: true }
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

/**
 * @args
 *   @getDisplayArgsForIndex
 *      Given index of child, return desired displayArgs (e.g. x, y, rotation) for child.
 *      When an item's position changes, this will be called with the new index, and the result will be assigned to the child.
 *      Example: i => ({ x: i * 10, y: i * 20 })
 */
export function For<T extends { key: string | number }[] | (string | number)[]>(
    items: RODatum<T> & { destroy?: Callback },
    render: (item: T[number]) => DisplayObject,
    getDisplayArgsForIndex?: (index: number) => DisplayObjectArgs,
    displayArgs?: ContainerArgs,
    destroyOptions: DestroyOptions = { children: true }
): PixiContainer {
    let warnedAlready = false
    const root = Container({}) as KeyedContainer
    onDestroyed(
        root,
        () => items?.destroy?.(),
        items.onChange(handleUpdate, true)
    )

    if (displayArgs != null) applyDisplayObjectArgs(root, displayArgs)
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
        if (getDisplayArgsForIndex != null) {
            root.children.forEach((c, i) => {
                const args = getDisplayArgsForIndex(i)
                //@ts-expect-error
                applyDisplayObjectArgs(c, args)
                // Object.keys(args).forEach(key => (c[key] = args[key]))
            })
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
/**
 * Portalize inserts content at a desired location,
 * but attaches its lifecycle to `from`.
 * It's for binding destroy to one DisplayObject
 * placing within another Container.
 */
export function portalize(args: {
    from?: DisplayObject
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
        from?.on('destroyed', () => {
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
