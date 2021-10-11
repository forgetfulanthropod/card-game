import { Matrix, utils } from 'pixi.js'
import healthBorderPng from '../assets/HEALTH_BORDER.png'
import { Container, Graphics, PixiContainer, PixiGraphics, PixiLoader, Sprite, Text } from './mypixi'

type Rect = [
    number, // x
    number, // y
    number, // width
    number, // height
]

export default function HealthBar(
    props: {
        value: number,
        max: number,
        colorStops?: { color: string, stop: number }[],
        numberColor?: string
    }
): PixiContainer {
    // TODO:
    // const { isDeluxeLoaded } = useLoaderContext()
    const portion = props.value / props.max

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

    const colorStops = props.colorStops ?? [
        { color: '#98040c', stop: .2 },
        { color: '#fff133', stop: .4 },
        { color: '#91ff85', stop: 1 },
    ]
    const background = ([...colorStops]
        .sort((cs1, cs2) => cs1.stop - cs2.stop)
        .find(cs => portion <= cs.stop) || { color: 'pink' }).color

    const color = props.numberColor ?? background


    function drawHealthBar(g: PixiGraphics) {
        g.clear()
        const color = utils.string2hex(background)
        g.beginFill(color)
        g.drawRect(...rect)
        // const healthTexture =
        // if (isDeluxeLoaded) {
        const texture = PixiLoader.shared.resources?.healthTexture?.texture
        const data = PixiLoader.shared.resources?.healthTexture?.data

        g.beginTextureFill({
            texture,
            color,
            alpha: 1,
            matrix: new Matrix(.1, 0, 0, .1, 0, 0)
        })
        g.drawRect(...rect)
        // }
        g.endFill()
    }

    return Container({
        name: HealthBar.name,
        x: 0,
        y: 0,
        zIndex: 2,
        children: [
            Graphics({ draw: drawHealthBar }),
            Sprite({
                src: healthBorderPng,
                width: displayWidth,
                height: displayHeight
            }),
            Text({
                text: props.value.toString(),
                anchor: [0, 1],
                style: {
                    fontFamily: 'monospace',
                    fontSize: 30,
                    fill: ['#ffeaab', '#f2b600'], // gradient
                    letterSpacing: -5,
                },
            })
        ]
    })
}
