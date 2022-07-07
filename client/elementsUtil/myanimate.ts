import { Graphics, MovieClip, load } from '@pixi/animate'
//@ts-expect-error
import data from '../animations/KC_FX_BasicAttack002_v02.js'
import { nextTick } from '@/util/misc.js'

export function loadAnimation(): Promise<void> {
    data.setup({ MovieClip, Graphics })

    return new Promise(resolve =>
        load(data, () => {
            clip = getNewClip()
            resolve()
        })
    )
}

let clip: MovieClip | null = null
export function Animation(): MovieClip | null {
    if (clip) console.log('not making clip')
    if (clip) {
        void nextTick().then(() => clip?.gotoAndPlay(0))
        return clip
    }
    if (data.lib.KC_FX_BasicAttack002_v02 == null) return null

    return (clip = getNewClip())
}

function getNewClip() {
    const newClip = new data.lib.KC_FX_BasicAttack002_v02()

    newClip.y -= 300
    newClip.loop = false
    newClip.autoReset = true

    return newClip
}
// const animation = new Animator()

// data.setup({ MovieClip, Graphics })

// const root = Container({})

// load(data, _asset => {
//     // root.addChild(new (asset?.stage)())
//     // new data.lib.KC_FX_BasicAttack002_v02()

//     // console.log({
//     //     data,
//     //     asset,
//     //     constructrr: data.lib.KC_FX_BasicAttack002_v02,
//     // })
//     const animation = new data.lib.KC_FX_BasicAttack002_v02()

//     root.addChild(animation)
// })

// return (animation = root)
// return Container({})
