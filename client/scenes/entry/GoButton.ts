import { collectData } from '@/analytics/collectData'
import { callApi } from '@/callApi'
import { callServerApi } from '@/callServerApi'
import { getTree } from '@/data'
import {
    addFilterTo,
    customGlowFilter,
    fontMap,
    onDestroyed,
    removeFilterFrom,
} from '@/elementsUtil'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    Text,
    RoundedRectangleGradientSprite,
} from '@/elementsUtil'
import { OutlineFilter, DropShadowFilter } from 'pixi-filters'
import { Easing, Tweener } from 'pixi-tweener'

export function GoButton() {
    const startRun = async () => {
        root.interactive = false
        const userId = getTree().get('username')
        const { runId } = await callServerApi('startRun', {
            userId,
        })
        await callApi('changeScene', { newSceneName: 'battle' })
        await callApi('setRunId', { userId, runId })
        collectData('run_start', {
            map_seed: 1,
            run_id: runId,
        })
    }

    const bg = RoundedRectangleGradientSprite({
        spriteArgs: {
            width: 300,
            height: 100,
            x: 0,
            y: 0,
            name: 'ButtonGradientBg',
            anchor: [0.5, 0.5],
            alpha: 1,
        },
        radius: 20,
        gradientArgs: {
            x0: 0,
            x1: 200,
            y0: 0,
            y1: 0,
            colorStops: [
                { color: 0x109f10, offset: 0 },
                { color: 0x36e736, offset: 1 },
            ],
        },
    })

    const text = Text({
        text: 'GO!',
        style: {
            fill: 'white',
            fontFamily: fontMap['bigFont'],
            fontSize: 72,
        },
        anchor: [0.5, 0.5],
    })

    const outlineFilter = new OutlineFilter(5, 0x002717)
    const glowFilter = customGlowFilter(0xdafbda, 3)
    const shadowFilter = new DropShadowFilter({
        offset: { x: 0, y: 10 },
        color: 0x000000,
        blur: 3,
        quality: 2,
    })

    outlineFilter.resolution = 2

    bg.filters = [outlineFilter, shadowFilter]
    text.filters = [outlineFilter]

    bg.cursor = `url('assets/root/hand.webp'), pointer`

    const root = Container(
        {
            x: BASE_WIDTH * 0.85,
            y: BASE_HEIGHT * 0.88,
            onClick: async () => await startRun(),
            events: {
                pointerenter() {
                    //@ts-ignore
                    glowFilter.alpha = 0
                    removeFilterFrom(bg, shadowFilter)
                    addFilterTo(bg, glowFilter)
                    Tweener.add(
                        {
                            //@ts-ignore
                            target: glowFilter,
                            duration: 0.1,
                            ease: Easing.easeTo,
                        },
                        { alpha: 1 }
                    )
                },
                pointerleave() {
                    addFilterTo(bg, shadowFilter)
                    removeFilterFrom(bg, glowFilter)
                },
            },
        },
        bg,
        text
    )

    return onDestroyed(root, () => {
        outlineFilter.destroy()
        glowFilter.destroy()
        shadowFilter.destroy()
    })
}
