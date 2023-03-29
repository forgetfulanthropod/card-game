import {
    addFilterTo,
    fontMap,
    onDestroyed,
    removeFilterFrom,
} from '@/elementsUtil'
import { Container, Text, RoundedRectangleGradientSprite } from '@/elementsUtil'
import { OutlineFilter, HslAdjustmentFilter } from 'pixi-filters'
import { Easing, Tweener } from 'pixi-tweener'

export function GradientButton(args: {
    onClick: Callback
    text: string
    x: number
    y: number
    fontSize?: number
    gradientFrom?: number
    gradientTo?: number
    outlineColor?: number
    xPadding?: number
    yPadding?: number
    extraWide?: boolean
}) {
    const {
        text,
        fontSize = 30,
        gradientFrom,
        gradientTo,
        x,
        y,
        onClick,
        outlineColor,
        extraWide,
        xPadding,
        yPadding,
    } = args

    const ButtonText = Text({
        text: text.toUpperCase(),
        style: {
            fill: 'white',
            fontFamily: fontMap['bigFont'],
            fontSize: fontSize,
        },
        anchor: [0.5, 0.5],
    })

    const ButtonBg = RoundedRectangleGradientSprite({
        spriteArgs: {
            width: ButtonText.width + (extraWide ? 150 : 100) + (xPadding ?? 0 * 10),
            height: ButtonText.height + 25 + (yPadding ?? 0 * 10),
            x: 0,
            y: 0,
            name: 'ButtonGradientBg',
            anchor: [0.5, 0.5],
            alpha: 1,
        },
        radius: 12,
        gradientArgs: {
            x0: 0,
            x1: 250,
            y0: 0,
            y1: 0,
            colorStops: [
                { color: gradientFrom ?? 0x109f10, offset: 0 },
                { color: gradientTo ?? 0x36e736, offset: 1 },
            ],
        },
    })

    const outlineFilter = new OutlineFilter(5, outlineColor ?? 0x002717)
    const hoverFilter = new HslAdjustmentFilter({ lightness: -0.2 })

    outlineFilter.resolution = 2

    ButtonBg.filters = [outlineFilter]
    ButtonText.filters = [outlineFilter]

    ButtonBg.cursor = `url('assets/root/hand.webp'), pointer`

    const root = Container(
        {
            x,
            y,
            onClick,
            events: {
                pointerenter() {
                    //@ts-ignore
                    hoverFilter.alpha = 0
                    addFilterTo(ButtonBg, hoverFilter)
                    Tweener.add(
                        {
                            //@ts-ignore
                            target: hoverFilter,
                            duration: 0.15,
                            ease: Easing.easeTo,
                        },
                        { alpha: 1 }
                    )
                },
                pointerleave() {
                    removeFilterFrom(ButtonBg, hoverFilter)
                },
            },
        },
        ButtonBg,
        ButtonText
    )

    return onDestroyed(root, () => {
        Tweener.killTweensOf(hoverFilter)
        outlineFilter.destroy()
        hoverFilter.destroy()
    })
}
