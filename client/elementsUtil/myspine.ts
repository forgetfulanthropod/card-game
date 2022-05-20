import type { SkeletonData } from '@pixi-spine/all-4.0'
import { Spine as PixiSpine } from '@pixi-spine/all-4.0'
export { PixiSpine }
import { Loader } from 'pixi.js'
import type { ROCursor } from 'sbaobab'

import type { InteractionEvents } from './InteractionEvents'
import { bindEvents } from './InteractionEvents'
import type {
    AnimationsOf,
    SpineAsset,
} from '@/features/battle/logic/spineAssets'
import { onUpdate } from '@/util/onUpdate'

export function Spine<Name extends SpineAsset>(props: {
    name: Name
    animation?: AnimationsOf<Name> | ROCursor<AnimationsOf<Name>>
    x?: number
    y?: number
    size?: [number, number]
    events?: InteractionEvents
}): PixiSpine {
    const spine = new PixiSpine(spineData(props.name))
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

    spine.cursor = spine.interactive ? 'pointer' : 'default'

    const destroy = spine.destroy
    spine.destroy = (...args) => {
        void (unsub && unsub())
        destroy.call(spine, ...args)
    }
    return spine
}

function spineData(name: SpineAsset): SkeletonData {
    return (
        Loader.shared.resources[name].spineData ??
        throwNull(`spineData '${name}'`)
    )
}
