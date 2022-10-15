import type { SkeletonData } from '@pixi-spine/all-4.1'
import { Spine as PixiSpine } from '@pixi-spine/all-4.1'
import { Loader } from 'pixi.js'
import type { ROCursor } from 'sbaobab'

import type { CharacterId } from 'shared'
import type { InteractionEvents } from './mypixi'
import { bindEvents, startChecking } from './mypixi'
import type { AnimationId, SpineAsset } from '@/assets'
import { haveEvilSkins } from '@/assets'
import { onUpdate } from '@/util'

export { PixiSpine }

export function Spine<Name extends SpineAsset>(props: {
    name: Name
    animation?: AnimationId | ROCursor<AnimationId>
    x?: number
    y?: number
    size?: [number, number]
    events?: InteractionEvents
    onSpineEvent?: (e: string) => void
    onDestroy?: Callback[]
    isPc?: boolean
}): PixiSpine {
    const spine = new PixiSpine(spineData(props.name))

    if (haveEvilSkins[props.name.replace('Spine', '') as CharacterId]) {
        const skinNames = spine.skeleton.data.skins.map(skin => skin.name)

        console.log({ skinNames })

        if (!skinNames?.[1]) console.error('missing the second (evil) skin...')

        spine.skeleton.setSkinByName(skinNames[props.isPc ? 0 : 1])
    }

    if (props.x != null) spine.x = props.x
    if (props.y != null) spine.y = props.y
    if (props.size != null) [spine.width, spine.height] = props.size

    bindEvents(props.events, spine)

    let unsub: null | Callback = null
    if (typeof props.animation === 'string') {
        spine.state.setAnimation(0, props.animation, true)
    } else if (props.animation != null && typeof props.animation === 'object') {
        unsub = onUpdate(props.animation, animation => {
            spine.state.setAnimation(0, animation, true)
        })
    }

    spine.state.addListener({
        event(entry, event) {
            props.onSpineEvent?.(event.data.name)
        },
    })

    spine.cursor = spine.interactive
        ? `url('assets/root/hand.webp'), pointer`
        : 'default'

    const destroy = spine.destroy
    spine.destroy = (...args) => {
        void (unsub && unsub())
        destroy.call(spine, ...args)
    }

    if (props.onDestroy != null) {
        spine.on('destroyed', () => {
            props?.onDestroy?.forEach(cb => cb())
        })
    }

    startChecking(spine)
    return spine
}

function spineData(name: SpineAsset): SkeletonData {
    return (
        Loader.shared.resources[name].spineData ??
        throwNull(`spineData '${name}'`)
    )
}
