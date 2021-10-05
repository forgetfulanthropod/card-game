import type { h, JSX } from 'preact'
import { Container, Graphics, Sprite, Text } from '@inlet/react-pixi'
import { Graphics as PixiGraphics, Loader, Matrix, TextStyle, utils } from 'pixi.js'
import { useCallback } from 'preact/hooks'
import healthBorderPng from '../assets/HEALTH_BORDER.png'
import { useLoaderContext } from '../providers/LoaderProvider'


export default function HealthBar(
    props: {
        value: number,
        max: number,
        colorStops?: { color: string, stop: number }[],
        numberColor?: string
    }
): JSX.Element {
    const { isDeluxeLoaded } = useLoaderContext()
    // toast(`isDeluxLoaded: ${isDeluxeLoaded}`)
    // const [goodTexture, setGoodTexture] = useState<Texture>()
    // const [badTexture, setBadTexture] = useState<Texture>()

    // useEffect(() => {
    //     setGoodTexture(Texture.from(goodHealthTexturePng))
    //     setBadTexture(Texture.from(badHealthTexturePng))
    // }, [])



    const DISPLAY_WIDTH = 140
    const RAW_WIDTH = 1841
    const RAW_HEIGHT = 161
    const WIDTH_TO_HEIGHT = RAW_HEIGHT / RAW_WIDTH
    const DISPLAY_HEIGHT = DISPLAY_WIDTH * WIDTH_TO_HEIGHT
    const X_MARGIN = .01869158878
    const Y_MARGIN = .16883116883
    const portion = props.value / props.max
    // const width = `${portion * 100}%`
    const rectWidth = portion * DISPLAY_WIDTH * (1 - 2 * X_MARGIN)
    const rectHeight = DISPLAY_HEIGHT * (1 - 2 * Y_MARGIN)
    const rectXOffset = DISPLAY_WIDTH * X_MARGIN
    const rectYOffset = DISPLAY_HEIGHT * Y_MARGIN

    const colorStops = props.colorStops ?? [
        { color: '#98040c', stop: .2 },
        { color: '#fff133', stop: .4 },
        { color: '#91ff85', stop: 1 },
    ]
    const background = ([...colorStops]
        .sort((cs1, cs2) => cs1.stop - cs2.stop)
        .find(cs => portion <= cs.stop) || { color: 'pink' }).color

    const color = props.numberColor ?? background


    const draw = useCallback(function drawHealthBar(g: PixiGraphics) {
        g.clear()
        const color = utils.string2hex(background)
        g.beginFill(color)
        g.drawRect(rectXOffset, rectYOffset, rectWidth, rectHeight)
        // const healthTexture =
        if (isDeluxeLoaded) {
            const texture = Loader.shared.resources?.healthTexture?.texture
            const data = Loader.shared.resources?.healthTexture?.data
            console.log({ texture, data })
            g.beginTextureFill({
                texture,
                color,
                alpha: 1,
                matrix: new Matrix(.1, 0, 0, .1, 0, 0)
            })
            g.drawRect(rectXOffset, rectYOffset, rectWidth, rectHeight)
        }
        g.endFill()
    }, [rectWidth, color, background, isDeluxeLoaded])

    return <Container x={0} y={10}>
        <Graphics {...{ draw }} />
        <Sprite image={healthBorderPng} width={DISPLAY_WIDTH} height={DISPLAY_HEIGHT} />
        <Text
            text={props.value.toString()}
            anchor={{ x: 0, y: 1 }}
            style={
                new TextStyle({
                    fontFamily: 'monospace',
                    fontSize: 30,
                    //   fontWeight: 400,
                    fill: ['#ffeaab', '#f2b600'], // gradient
                    // stroke: '#01d27e',
                    // strokeThickness: 5,
                    letterSpacing: -5,
                    // dropShadow: true,
                    // dropShadowColor: '#ccced2',
                    // dropShadowBlur: 4,
                    // dropShadowAngle: Math.PI / 6,
                    // dropShadowDistance: 6,
                    // wordWrap: true,
                    // wordWrapWidth: 440,
                })
            }
        />
    </Container>
}
