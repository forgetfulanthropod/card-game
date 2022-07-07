import { Graphics, MovieClip, load } from '@pixi/animate'
import data from '../animations/KC_FX_BasicAttack002_v01.js'

export function loadAnimation(): Promise<void> {
    data.setup({ MovieClip, Graphics })

    return new Promise(resolve =>
        load(data, () => {
            resolve()
            const newClip = new data.lib.KC_FX_BasicAttack002_v01()

            newClip.y -= 300

            clip = newClip
        })
    )
}

let clip: MovieClip | null = null
export function Animation(): MovieClip | null {
    if (clip) console.log('not making clip')
    if (clip) return clip
    if (data.lib.KC_FX_BasicAttack002_v01 == null) return null

    return (clip = new data.lib.KC_FX_BasicAttack002_v01())
}

// const animation = new Animator()

// data.setup({ MovieClip, Graphics })

// const root = Container({})

// load(data, _asset => {
//     // root.addChild(new (asset?.stage)())
//     // new data.lib.KC_FX_BasicAttack002_v01()

//     // console.log({
//     //     data,
//     //     asset,
//     //     constructrr: data.lib.KC_FX_BasicAttack002_v01,
//     // })
//     const animation = new data.lib.KC_FX_BasicAttack002_v01()

//     root.addChild(animation)
// })

// return (animation = root)
// return Container({})
