import { range } from 'lodash'
import { Rectangle, Texture } from 'pixi.js'
import type { PixiSpine } from '@/elementsUtil'
import { getRenderer, Spine, Text, fontMap } from '@/elementsUtil'

let lastRandomIndex = 1
export function HitInfo(args: {
    damage: number | string
    isPoison?: boolean
}): PixiSpine {
    const root = Spine({
        name: 'damageTextSpine',
    })
    root.scale.set(0.6)

    range(0, 10).forEach(n => {
        root.hackTextureAttachment(
            `Museo Sans Rounded ${n}`,
            `Museo Sans Rounded ${n}`,
            Texture.EMPTY,
            new Rectangle(0, 0, 10, 10)
        )
    })

    const text = Text({
        text: args.damage,
        style: {
            fontFamily: fontMap['bigFont'],
            fontSize: 150,
            stroke: 0,
            strokeThickness: 10,
            fill: 0xffffff,
        },
    })
    const textTexture = getRenderer().generateTexture(text)
    text.destroy(true)

    const relevantSlotIndex = 0

    setTimeout(
        () =>
            root.hackTextureAttachment(
                `Museo Sans Rounded ${relevantSlotIndex}`,
                `Museo Sans Rounded ${relevantSlotIndex}`,
                textTexture,
                // Texture.WHITE,
                new Rectangle(-100, -100, 100, 100)
            ),
        0
    )

    const randomAnimation = `Animations/Regular Position ${lastRandomIndex}`

    lastRandomIndex = (lastRandomIndex % 3) + 1

    const loop = true
    root.state.setAnimation(0, randomAnimation, loop)

    return root

    // return Text({
    //     text: `${args.damage}`,
    //     anchor: [0, 1],
    //     style: {
    //         fontFamily: ['Aesthet Nova', 'monospace'],
    //         fontSize: 60,
    //         fill: args.isPoison
    //             ? ['rgb(143,253,49)', 'rgb(43,148,52)']
    //             : ['#D74222', '#d66249'], // gradient
    //         letterSpacing: -5,
    //         dropShadow: true,
    //         dropShadowColor: '#eeeeee',
    //     },
    // })
}
