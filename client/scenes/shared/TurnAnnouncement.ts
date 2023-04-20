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
    TweenablePixiContainer,
} from '@/elementsUtil'
import { toDatum } from '@/util'
import { ColorOverlayFilter } from 'pixi-filters'
import { Easing, Tweener } from 'pixi-tweener'
import { sleep } from 'shared/code'
import {
    runKeyframeAnimations,
    waitForAnimationsToFinish,
} from './tweenerAnimations'

type TurnType = 'user' | 'enemy' | 'regularBattleStart' | 'bossBattleStart'

export function TurnAnnouncement() {
    const MainContainer = TweenableContainer({
        // events: {
        //     pointerenter: () => void 0,
        // },
    })
    // MainContainer.interactive = true
    // MainContainer.cursor = 'default'

    const scene = getBattleScene()
    const isPlayerTurnDatum = toDatum(
        scene.select('isPlayerTurn'),
        isPlayerTurn => isPlayerTurn
    )
    const playerTurnUnsub = isPlayerTurnDatum.onChange(async isPlayerTurn => {
        const battleState = scene.get('state')
        const currTurnCount = scene.get('turnCount')
        const isBossFight =
            scene.get('currentRoom').enemies.filter(enemy => enemy?.boss)
                .length > 0
        if (battleState !== 'in battle') return
        if (currTurnCount === 1 && isPlayerTurn) {
            await sleep(250) // wasnt working without this on first turn
            if (isBossFight) await flashTurnAnnouncement('bossBattleStart')
            else await flashTurnAnnouncement('regularBattleStart')
        }
        if (isPlayerTurn) await flashTurnAnnouncement('user', currTurnCount)
        else await flashTurnAnnouncement('enemy')
    }, true)

    const [baseX, baseY] = [BASE_WIDTH / 2, BASE_HEIGHT / 2 - 130]

    function getMainText(turnType: TurnType) {
        const text = Text({
            text:
                turnType === 'regularBattleStart'
                    ? 'BATTLE START'
                    : turnType === 'bossBattleStart'
                    ? 'BOSS BATTLE START'
                    : turnType === 'user'
                    ? 'YOUR TURN'
                    : 'ENEMY TURN',
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
        const overlayFilter = new ColorOverlayFilter(0x868998)
        const crossedSwords = TweenableContainer(
            {
                x: baseX,
                y: baseY + 20,
                alpha: 0,
                scale: 1.25,
            },
            Sprite({
                src: getTexture('crossedSwords'),
                alpha: 1,
                anchor: [0.5, 0.5],
                tint: 0x42444d,
            })
        )
        addFilterTo(crossedSwords, overlayFilter)
        return onDestroyed(crossedSwords, () => {
            removeFilterFrom(crossedSwords, overlayFilter)
            overlayFilter.destroy()
        })
    }

    function getBannerBg(turnType: TurnType) {
        const colorFrom = 0x1c1d21
        const colorTo = 0x42444d

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
                    { color: colorFrom, offset: 0 },
                    { color: colorTo, offset: 1 },
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
        turnType: TurnType,
        turnCount?: number
    ) {
        MainContainer.alpha = 1
        const MainText = getMainText(turnType)
        const BannerBg = getBannerBg(turnType)
        const CrossedSwords = getCrossedSwordsSprite()
        let TurnCountText: TweenablePixiContainer | null = null
        MainContainer.addChild(BannerBg, CrossedSwords, MainText)

        Tweener.add(
            {
                target: BannerBg,
                duration: 0.5,
                ease: Easing.easeInOutExpo,
            },
            { x: 0, alpha: 0.85 }
        )
        await sleep(200)
        runKeyframeAnimations(MainText, 0.65, {
            keyframes: 1,
            alpha: 1,
            ease: Easing.bouncePast,
        })

        if (turnType === 'user' && turnCount) {
            TurnCountText = getTurnCountText(turnCount)
            MainContainer.addChild(TurnCountText)
            await runKeyframeAnimations(TurnCountText, 0.3, {
                keyframes: 1,
                alpha: 1,
                ease: Easing.bouncePast,
            })
            await runKeyframeAnimations(MainContainer, 0.4, {
                keyframes: 1, // short pause
            })
            await runKeyframeAnimations(CrossedSwords, 0.45, {
                keyframes: 1,
                ease: Easing.bouncePast,
                tweenableScale: 0.6,
                alpha: 0.5,
            })
            await runKeyframeAnimations(MainContainer, 0.15, {
                keyframes: 1, // short pause
            })
        } else if (turnType === 'regularBattleStart') {
            await runKeyframeAnimations(MainContainer, 1, {
                keyframes: 1, // longer pause for 1st turn
            })
        } else {
            await runKeyframeAnimations(MainContainer, 0.9, {
                keyframes: 1, // pause
            })
        }

        runKeyframeAnimations(CrossedSwords, 0.45, {
            ease: Easing.easeFrom,
            keyframes: 1,
            alpha: 0,
        })
        runKeyframeAnimations(MainText, 0.45, {
            ease: Easing.easeFrom,
            keyframes: 1,
            alpha: 0,
        })
        TurnCountText &&
            runKeyframeAnimations(TurnCountText, 0.45, {
                ease: Easing.easeFrom,
                keyframes: 1,
                alpha: 0,
            })

        await Tweener.add(
            {
                target: BannerBg,
                duration: 0.6,
                ease: Easing.easeInOutExpo,
            },
            { x: BannerBg.width, alpha: 0.3 }
        )
        for (let element of MainContainer.children) {
            await waitForAnimationsToFinish()
            element.destroy()
        }
        MainContainer.removeChildren()
    }

    return onDestroyed(MainContainer, () => playerTurnUnsub())
}
