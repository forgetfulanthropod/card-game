import { getBattleScene } from '@/data'
import {
    addFilterTo,
    BASE_HEIGHT,
    BASE_WIDTH,
    fontMap,
    getTexture,
    onDestroyed,
    removeFilterFrom,
    RoundedRectangleGradientSprite,
    Sprite,
    Text,
    textOutlineFilter,
    TweenableContainer,
} from '@/elementsUtil'
import { toDatum } from '@/util'
import { ColorOverlayFilter } from 'pixi-filters'
import { Easing, Tweener } from 'pixi-tweener'
import { sleep } from 'shared/code'
import { runKeyframeAnimations } from './tweenerAnimations'

type TurnType = 'user' | 'enemy'

export function TurnAnnouncement() {
    const MainContainer = TweenableContainer({
        events: {
            pointerenter: () => void 0,
        },
    })
    MainContainer.interactive = true
    MainContainer.cursor = 'default'

    const scene = getBattleScene()
    const isPlayerTurnDatum = toDatum(
        scene.select('isPlayerTurn'),
        isPlayerTurn => isPlayerTurn
    )
    const playerTurnUnsub = isPlayerTurnDatum.onChange(async isPlayerTurn => {
        const battleState = scene.get('state')
        const currTurnCount = scene.get('turnCount')
        if (battleState !== 'in battle') return
        if (currTurnCount === 1) await sleep(50) // wasnt working without this on first turn
        if (isPlayerTurn) flashTurnAnnouncement('user', currTurnCount)
        else flashTurnAnnouncement('enemy')
    }, true)

    const [baseX, baseY] = [BASE_WIDTH / 2, BASE_HEIGHT / 2 - 130]

    function getMainText(turnType: TurnType) {
        const text = Text({
            text: turnType === 'user' ? 'YOUR TURN' : 'ENEMY TURN',
            style: {
                fontFamily: fontMap['bigFont'],
                fill: '#FFFFFF',
                fillGradientType: 1,
                fontSize: turnType === 'user' ? 80 : 96,
            },
            anchor: [0.5, 0.5],
        })
        const textContainer = TweenableContainer(
            {
                x: baseX,
                y: turnType === 'user' ? baseY : baseY + 25,
                scale: 1,
                alpha: 0,
            },
            text
        )
        addFilterTo(text, textOutlineFilter)
        return textContainer
    }

    function getCrossedSwordsSprite() {
        const overlayFilter = new ColorOverlayFilter(0xc0c8d8)
        const crossedSwords = TweenableContainer(
            {
                x: baseX,
                y: baseY + 20,
                alpha: 0,
                scale: 0.75,
            },
            Sprite({
                src: getTexture('crossedSwords'),
                alpha: 1,
                anchor: [0.5, 0.5],
                tint: 0x1c1d21,
            })
        )
        addFilterTo(crossedSwords, overlayFilter)
        return onDestroyed(crossedSwords, () => {
            removeFilterFrom(crossedSwords, overlayFilter)
            overlayFilter.destroy()
        })
    }

    function getBannerBg() {
        return RoundedRectangleGradientSprite({
            spriteArgs: {
                width: BASE_WIDTH,
                height: 190,
                x: -BASE_WIDTH,
                y: BASE_HEIGHT / 2 - 200,
                name: 'TurnAnnouncementBg',
                alpha: 0.3,
            },
            radius: 0,
            gradientArgs: {
                x0: 0,
                x1: BASE_WIDTH,
                y0: 0,
                y1: 700,
                colorStops: [
                    { color: 0x1c1d21, offset: 0 },
                    { color: 0x42444d, offset: 1 },
                ],
            },
        })
    }

    function getTurnCountText(turnCount: number) {
        return TweenableContainer(
            {
                x: baseX,
                y: baseY + 65,
                alpha: 0,
            },
            Text({
                text: `Turn #${turnCount}`,
                style: {
                    fontFamily: fontMap['sansFont'],
                    fill: 0xfbda9d,
                    fontSize: 28,
                },
                anchor: [0.5, 0.5],
            })
        )
    }

    async function flashTurnAnnouncement(
        turnType: 'user' | 'enemy',
        turnCount?: number
    ) {
        MainContainer.alpha = 1
        const MainText = getMainText(turnType)
        const BannerBg = getBannerBg()
        MainContainer.addChild(BannerBg, MainText)

        Tweener.add(
            {
                target: BannerBg,
                duration: 0.35,
                ease: Easing.easeInOutExpo,
            },
            { x: 0, alpha: 0.85 }
        )

        await sleep(150)

        runKeyframeAnimations(MainText, 0.45, {
            keyframes: 1,
            alpha: 1,
            ease: Easing.bouncePast,
        })

        if (turnType === 'user' && turnCount) {
            const TurnCountText = getTurnCountText(turnCount)
            const CrossedSwords = getCrossedSwordsSprite()
            MainContainer.addChild(TurnCountText, CrossedSwords)
            await runKeyframeAnimations(TurnCountText, 0.3, {
                keyframes: 1,
                alpha: 1,
                ease: Easing.bouncePast,
            })
            await runKeyframeAnimations(CrossedSwords, 0.45, {
                keyframes: 1,
                ease: Easing.bouncePast,
                tweenableScale: 0.25,
                alpha: 0.3,
            })
            await runKeyframeAnimations(MainContainer, 0.05, {
                keyframes: 1, // pause
            })
        } else {
            await runKeyframeAnimations(MainContainer, 0.65, {
                keyframes: 1, // pause
            })
        }

        runKeyframeAnimations(MainContainer, 0.4, {
            ease: Easing.easeFrom,
            keyframes: 1,
            alpha: 0,
        })

        await Tweener.add(
            {
                target: BannerBg,
                duration: 0.5,
                ease: Easing.easeInOutExpo,
            },
            { x: BannerBg.width, alpha: 0.3 }
        )
        for (let element of MainContainer.children) {
            element.destroy()
        }
        MainContainer.removeChildren()
    }

    return onDestroyed(MainContainer, () => playerTurnUnsub())
}
