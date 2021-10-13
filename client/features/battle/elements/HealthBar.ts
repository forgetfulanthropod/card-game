import { Matrix, utils } from 'pixi.js'

import { Container, Graphics, PixiContainer, PixiGraphics, PixiLoader, Sprite, Text } from './mypixi'

type Rect = [
    number, // x
    number, // y
    number, // width
    number, // height
]

type StanceType = 'defensive' | 'neutral' | 'aggressive'

export default function HealthBar(
    args: {
        value: number,
        max: number,
        colorStops?: { color: string, stop: number }[],
        numberColor?: string
        stance?: StanceType
    }
): PixiContainer {
    // TODO:
    // const { isDeluxeLoaded } = useLoaderContext()
    const portion = args.value / args.max

    const displayWidth = 140
    const rawWidth = 1841
    const rawHeight = 161
    const widthToHeight = rawHeight / rawWidth
    const displayHeight = displayWidth * widthToHeight
    const xMargin = .01869158878
    const yMargin = .16883116883
    // const width = `${portion * 100}%`
    const rect: Rect = [
        displayWidth * xMargin,
        displayHeight * yMargin,
        portion * displayWidth * (1 - 2 * xMargin),
        displayHeight * (1 - 2 * yMargin),
    ]

    const colorStops = args.colorStops ?? [
        { color: '#98040c', stop: .2 },
        { color: '#fff133', stop: .4 },
        { color: '#91ff85', stop: 1 },
    ]
    const background = ([...colorStops]
        .sort((cs1, cs2) => cs1.stop - cs2.stop)
        .find(cs => portion <= cs.stop) || { color: 'pink' }).color

    const color = args.numberColor ?? background


    function drawHealthBar(g: PixiGraphics) {
        g.clear()
        const color = utils.string2hex(background)
        g.beginFill(color)
        g.drawRect(...rect)
        // const healthTexture =
        // if (isDeluxeLoaded) {
        const texture = PixiLoader.shared.resources?.healthTexture?.texture

        g.beginTextureFill({
            texture,
            color,
            alpha: 1,
            matrix: new Matrix(.1, 0, 0, .1, 0, 0)
        })
        g.drawRect(...rect)

        g.endFill()
    }


    if (args.value == null) {
        // TODO: see TODO BqUPq
        return Container({ children: [] })
    }
    const mainEl = Container({
        name: HealthBar.name,
        x: 0,
        y: 0,
        zIndex: 2,
        children: [
            Graphics({ draw: drawHealthBar }),
            Sprite({
                src: PixiLoader.shared.resources?.healthBorder?.data,
                width: displayWidth,
                height: displayHeight
            }),
            Text({
                text: args.value.toString(),
                anchor: [0, 1],
                style: {
                    fontFamily: 'monospace',
                    fontSize: 30,
                    fill: ['#ffeaab', '#f2b600'], // gradient
                    letterSpacing: -5,
                },
            }),
        ]
    })

    const stanceSrc = args.stance == null ? null :
        args.stance === 'neutral' ? PixiLoader.shared.resources?.stanceNeutral?.data :
            args.stance === 'aggressive' ? PixiLoader.shared.resources?.stanceAggressive?.data :
                args.stance === 'defensive' ? PixiLoader.shared.resources?.stanceDefensive?.data : null

    if (stanceSrc != null) {
        mainEl.addChild(Sprite({
            src: stanceSrc,
            x: displayWidth,
            y: displayHeight * 1.1,
            anchor: [1, 0],
            width: displayWidth / 3,
            height: displayWidth / 3 / stanceSrc.width * stanceSrc.height
        }))
    }

    return mainEl
}
