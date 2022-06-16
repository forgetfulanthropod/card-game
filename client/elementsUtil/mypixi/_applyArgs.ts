import type { Filter as PixiFilter } from 'pixi.js'
import { assertFinite } from 'shared/code'
import { bindEvents } from './InteractionEvents'
import { PixiTicker } from './aliases'
import type {
    PixiContainer,
    PixiGraphics,
    PixiSprite,
    PixiText,
} from './aliases'
import type { DisplayObjectArgs, ShownArgs, ContainerArgs } from './_types'
import { bindIsHovered } from './_bindIsHovered'

export function applyDisplayObjectArgs(
    el: PixiContainer | PixiSprite | PixiText | PixiGraphics,
    args: DisplayObjectArgs
) {
    bindEvents(args.events, el)

    if (args.onClick != null) {
        el.interactive = true
        el.cursor = 'pointer'
        el.on('pointerdown', args.onClick)
    }

    if (args.onMouseover != null) {
        el.interactive = true
        el.on('pointerover', args.onMouseover)
    }
    if (args.onMouseout != null) {
        el.interactive = true
        el.on('pointerout', args.onMouseout)
    }

    if (args.position != null) {
        assertFinite(args.position)
        el.position.set(...args.position)
    }
    if (args.scale != null) {
        assertFinite(args.scale)
        if (Array.isArray(args.scale)) {
            el.scale.set(...args.scale)
        } else {
            el.scale.set(args.scale)
        }
    }

    if (args.width != null) {
        assertFinite(args.width)
        el.width = args.width
    }
    if (args.height != null) {
        assertFinite(args.height)
        el.height = args.height
    }
    if (args.pivot != null) {
        assertFinite(args.pivot)
        if (Array.isArray(args.pivot)) {
            el.pivot.set(...args.pivot)
        } else {
            el.pivot.set(args.pivot)
        }
    }
    if (args.x != null) {
        assertFinite(args.x)
        el.x = args.x
    }
    if (args.y != null) {
        assertFinite(args.y)
        el.y = args.y
    }

    if (args.onTick != null) {
        PixiTicker.shared.add(function cb(dt) {
            const result = args.onTick && args.onTick(el, dt)
            if (result === 'remove') PixiTicker.shared.remove(cb)
        })
    }

    if (args.alpha != null) {
        assertFinite(args.alpha)
        el.alpha = args.alpha
    }

    if (args.filters != null) {
        const filters = args.filters.filter(Boolean) as PixiFilter[]
        el.filters = filters
    }

    if (args.name != null) {
        el.name = args.name
    }

    if (args.zIndex != null) {
        el.zIndex = args.zIndex
    }
    if (args.visible != null) {
        el.visible = args.visible
    }

    if (args.angle != null) {
        assertFinite(args.angle)
        el.angle = args.angle
    }
    if (args.rotation != null) {
        assertFinite(args.rotation)
        el.rotation = args.rotation
    }

    if (args.onDestroy != null) {
        el.on('destroyed', () => {
            args?.onDestroy?.forEach(cb => cb())
        })
    }
    // if (args.onDestroy != null) {
    //     const destroy = el.destroy
    //     el.destroy = (...destroyArgs) => {
    //         destroy.call(el, ...destroyArgs)
    //         args.onDestroy?.forEach(cb => cb())
    //     }
    // }
    const isHoveredDatum = args.isHoveredDatum
    if (isHoveredDatum != null) {
        bindIsHovered(el, isHoveredDatum)
    }
}
export function applyShownArgs(x: PixiSprite | PixiText, args: ShownArgs) {
    applyDisplayObjectArgs(x, args)
    if (args.tint != null) {
        assertFinite(args.tint)
        x.tint = args.tint
    }

    if (args.anchor != null) {
        assertFinite(args.anchor)
        if (Array.isArray(args.anchor)) {
            x.anchor.set(...args.anchor)
        } else {
            x.anchor.set(args.anchor)
        }
    }
}
export function applyContainerArgs(args: ContainerArgs, c: PixiContainer) {
    for (const ch of args.children || []) {
        if (ch != null && ch !== false) {
            c.addChild(ch)
        }
    }
    applyDisplayObjectArgs(c, args)
    if (args.cache === true) {
        c.cacheAsBitmap = true
    }
}
