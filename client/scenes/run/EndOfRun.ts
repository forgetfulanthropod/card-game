import { GradientButton, InfoBox, ModalBackdrop } from '@sharedElements'
import {
    Adjust,
    animateNumberInElement,
    getShowOnHoverFns,
    loopSong,
    PixiContainer,
    RoundedRectangleGradientSprite,
    fontMap,
    getTexture,
    Text,
    TweenableContainer,
    TweenablePixiContainer,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    Sprite,
} from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { callApi } from '@/callApi'
import {
    BattleWinState,
    Leaderboard,
    RunID,
    RunScoreAttributeName,
    RUN_SCORE_EVENT_MAPPING,
    RUN_SCORE_EVENT_META,
    ScoreTags,
    TOP_PERCENTILE_CUTOFF,
} from 'shared'
import { DisplayObject, ITextStyle, Texture } from 'pixi.js'
import { random, round } from 'lodash'
import { collectData } from '@/analytics/collectData'
import { datum } from 'datums'
import { LeaderboardContainer } from './Leaderboards'
import { Easing, Tweener } from 'pixi-tweener'
import { OutlineFilter } from 'pixi-filters'

// Note: this file needs further refactoring

const slamAnimateElIntoScreen = async (el: TweenablePixiContainer) => {
    await Tweener.add(
        {
            target: el,
            duration: 1,
            ease: Easing.bouncePast,
        },
        {
            alpha: 1,
            tweenableScale: 0.7,
            x: BASE_WIDTH / 2 - 670,
            y: BASE_HEIGHT / 2 - 450,
        }
    )
}

const slamAnimateElIntoScreenStatic = async (el: TweenablePixiContainer) => {
    await Tweener.add(
        {
            target: el,
            duration: 1,
            ease: Easing.bouncePast,
        },
        {
            alpha: 1,
            tweenableScale: 1,
            x: el.x + el.width / 4,
            y: el.y,
        }
    )
}

const expandOut = async (el: TweenablePixiContainer) => {
    await Tweener.add(
        {
            target: el,
            duration: 0.5,
            ease: Easing.swingFromTo,
        },
        {
            alpha: 0.65,
            x: BASE_WIDTH / 2 - 775,
            y: BASE_HEIGHT / 2 - 175,
            tweenableScaleX: 1,
        }
    )

    await Tweener.add(
        {
            target: el,
            duration: 0.5,
            ease: Easing.swingFromTo,
        },
        {
            alpha: 0.65,
            x: BASE_WIDTH / 2 - el.width / 2,
            y: BASE_HEIGHT / 2 - 425,
            tweenableScaleY: 1,
        }
    )
}

const slideAndFadeOut = async (
    el: TweenablePixiContainer,
    result: BattleWinState
) => {
    await Tweener.add(
        {
            target: el,
            duration: 1,
            ease: result === 'lost' ? Easing.bounce : Easing.easeFromTo,
        },
        {
            alpha: 0,
            y: result === 'lost' ? BASE_HEIGHT / 2 : 0,
        }
    )
}

const transitionFadeChildren = async (
    el: PixiContainer,
    mode: 'sync' | 'async',
    velocity: 'fast' | 'slow',
    direction: 'in' | 'out'
) => {
    const { children } = el
    const addTweener = async (child: DisplayObject) => {
        return await Tweener.add(
            {
                target: child,
                duration: velocity === 'fast' ? 0.1 : 0.6,
                ease: Easing.easeFromTo,
            },
            {
                alpha: direction === 'in' ? 1 : 0,
            }
        )
    }
    if (mode === 'sync') {
        for (let child of children) {
            await addTweener(child)
        }
    } else if (mode === 'async') {
        children.forEach(async child => {
            await addTweener(child)
        })
    }
}

export const transitionFadeElement = async (
    el: PixiContainer,
    velocity: 'fast' | 'slow',
    direction: 'in' | 'out'
) => {
    return await Tweener.add(
        {
            target: el,
            duration: velocity === 'fast' ? 0.1 : 0.25,
            ease: Easing.easeInOutSine,
        },
        {
            alpha: 1,
        }
    )
}

export const transitionToScreen = async (
    mode: 'in' | 'out',
    ...elements: PixiContainer[]
) => {
    const duration = 0.3
    // the elements all transition at the same time on purpose
    elements.forEach(async el => {
        await Tweener.add(
            {
                target: el,
                duration,
                ease: Easing.easeInOutCirc,
            },
            {
                alpha: mode === 'out' ? 0 : 1,
                y: mode === 'out' ? el.y - 50 : el.y + 50,
            }
        )
    })

    await new Promise(resolve =>
        setTimeout(() => resolve(void 0), duration * 1000)
    )
    return
}

/** this should be in the server */
const getScoreTags = async ({
    runId,
    allTimeLeaderboards,
}: {
    runId: RunID
    allTimeLeaderboards: Leaderboard
}): Promise<ScoreTags> => {
    /** 0.01 === top 1% */
    let topPercentile: number = 1
    let isNewHighScore: boolean = false
    const leaderboardEntryCount = await callApi('getLeaderboardEntryCount', {})

    for (let entry of allTimeLeaderboards) {
        if (!entry.is_self) {
            continue
        }

        isNewHighScore = entry.run_id === runId ? true : false
        topPercentile =
            entry.run_id === runId
                ? entry.adjusted_rank / leaderboardEntryCount.count
                : 1
    }

    return {
        isNewHighScore,
        topPercentile,
    }
}

const getScoreItemPositionClosure = () => {
    let itemsOnScreen = 0
    return () => {
        itemsOnScreen++
        const ITEMS_PER_COLUMN = 10

        const leftColumnX = BASE_WIDTH / 2 - 680
        const rightColumnX = BASE_WIDTH / 2 + 130
        const x = itemsOnScreen <= ITEMS_PER_COLUMN ? leftColumnX : rightColumnX

        const Y_MARGIN = 50
        const Y_BASE = BASE_HEIGHT / 2 - 390
        const y =
            itemsOnScreen <= ITEMS_PER_COLUMN
                ? Y_BASE + Y_MARGIN * itemsOnScreen
                : Y_BASE + Y_MARGIN * (itemsOnScreen - ITEMS_PER_COLUMN)

        return { x, y }
    }
}

const getScoreItemPosition = getScoreItemPositionClosure()

const ScoreAttributeItem = (
    attribute: RunScoreAttributeName,
    score: number
) => {
    const { x, y } = getScoreItemPosition()
    const attributeEvent =
        RUN_SCORE_EVENT_MAPPING[attribute as RunScoreAttributeName]

    const { keyword, description, pointValue } =
        RUN_SCORE_EVENT_META[attributeEvent]

    const descriptionSubtitle = `${pointValue} ${
        pointValue === 1 ? 'point' : 'points'
    } per unit`

    const baseStyle: Partial<ITextStyle> = {
        fontSize: 24,
        fill: 'white',
        padding: 4,
        align: 'center',
        fontWeight: 'lighter',
        fontFamily: fontMap['bigFont'],
    }

    const Title = Text({
        text: `${keyword}   x   ${score}`,
        anchor: [0, 0.5],
        x,
        y,
        style: {
            ...baseStyle,
        },
        name: attribute,
    })

    const Points = Text({
        text: `${round(score * pointValue, 1)} pts`,
        anchor: [1, 0.5],
        x: x + 550,
        y,
        style: {
            ...baseStyle,
            fontFamily: fontMap['sansFont'],
        },
        name: `${attribute}_score`,
    })

    const ExplanationTitle = Text({
        text: description,
        x: 15,
        y: 10,
        style: {
            ...baseStyle,
            fill: 'white',
        },
    })
    const ExplanationSubtitle = Text({
        text: descriptionSubtitle,
        x: 15,
        y: 40,
        style: {
            ...baseStyle,
            fill: 0xdddddd,
            fontSize: 20,
            fontFamily: fontMap['sansFont'],
            fontStyle: 'italic',
        },
    })

    const outlineFilter = new OutlineFilter(3, 0x1f2633)

    const ExplanationInfoBox = InfoBox(
        Container({}, ExplanationTitle, ExplanationSubtitle),
        {
            x: x + Title.width + 25,
            y: y - 24,
            name: `${keyword} Explanation`,
            zIndex: 999,
            padding: 15,
            colorStops: [{ color: 0x364259, offset: 0 }],
            alpha: 0.95,
            filters: [outlineFilter],
        }
    )

    const { onMouseout, onMouseover } = getShowOnHoverFns(ExplanationInfoBox)

    const ScoreItemContainer = TweenableContainer(
        { onMouseover, onMouseout, alpha: 0 },
        Title,
        Points
    )

    return ScoreItemContainer
}

export function EndOfRun(): PixiContainer {
    collectData('ui_ux_view', { page_title: 'End of Run Screen' })

    const scene = getBattleScene()
    const battleState = scene.get('state')
    const showLeaderboard = datum(false)
    const mainContainerIsAnimating = datum(false)
    const userId = scene.get('userId')
    const runId = scene.get('runId')

    battleState === 'won'
        ? loopSong('runVictoryMusicHooligansBluff')
        : loopSong('defeatMusicHooligansBluff')

    // --- Pixi Elements ---
    let Leaderboard: PixiContainer<DisplayObject> | null = null
    const getRunResultBanner = () => {
        const src = getTexture(
            `${battleState === 'won' ? 'victory' : 'defeat'}`
        )
        return TweenableContainer(
            {
                scale: 0,
                alpha: 0.2,
                // x: BASE_WIDTH / 2 - (src.width * scale) / 2,
                x: BASE_WIDTH / 2,
                y: BASE_HEIGHT / 2 - 250,
            },
            Sprite({
                src,
            })
        )
    }

    const RunResultBanner = getRunResultBanner()

    const TopBorder = Sprite({
        src: Texture.WHITE,
        width: 1400,
        height: 2,
        x: BASE_WIDTH / 2 - 700,
        y: BASE_HEIGHT / 2 + 165,
        anchor: [0, 0.5],
        alpha: 0,
        tint: 0x424242,
    })

    const TotalScoreTitle = Text({
        text: `Total Score`,
        x: BASE_WIDTH / 2 - 650,
        y: BASE_HEIGHT / 2 + 250,
        anchor: [0, 0.5],
        style: {
            fontSize: 72,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'bold',
            fontFamily: fontMap['bigFont'],
        },
        name: 'TotalScoreTitle',
        alpha: 0,
    })

    const TotalScorePoints = Text({
        text: ``,
        anchor: [1, 0.5],
        x: BASE_WIDTH / 2 + 650,
        y: BASE_HEIGHT / 2 + 250,
        style: {
            fontSize: 64,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
            fontFamily: fontMap['sansFont'],
        },
        name: 'TotalScore',
        alpha: 0,
    })

    const NewHighScoreTag = () => {
        const Background = RoundedRectangleGradientSprite({
            spriteArgs: {
                width: 220,
                height: 50,
                anchor: [0, 0],
            },
            radius: 50,
            gradientArgs: {
                x0: 0,
                y0: 0,
                x1: 300,
                y1: 20,
                colorStops: [
                    { color: 0x184777, offset: 0 },
                    { color: 0x3ba1ba, offset: 1 },
                ],
            },
        })

        const HighScoreText = Text({
            text: '🎉  New High Score!',
            anchor: [0, 0],
            x: Background.width / 2,
            style: {
                fill: 0xffffff,
                fontFamily: fontMap['sansFont'],
                fontWeight: '300',
                fontSize: 20,
            },
        })

        return TweenableContainer(
            {
                name: `HighScoreTag_Container`,
                x: BASE_WIDTH / 2 - 370,
                y: BASE_HEIGHT / 2 + 230,
                alpha: 0,
                scale: 2,
            },
            Background,
            Adjust(HighScoreText, {
                x: Background.width / 2 - HighScoreText.width / 2,
                y: Background.height / 2 - HighScoreText.height / 2,
            })
        )
    }

    const TopPercentileTag = (percentile: number) => {
        const Background = RoundedRectangleGradientSprite({
            spriteArgs: {
                width: 140,
                height: 50,
                anchor: [0, 0],
            },
            radius: 30,
            gradientArgs: {
                x0: 0,
                y0: 0,
                x1: 110,
                y1: 20,
                colorStops: [
                    { color: 0xb64d2b, offset: 0 },
                    { color: 0xcb6616, offset: 1 },
                ],
            },
        })

        const HighScoreText = Text({
            text: `🚀  Top ${(percentile * 100).toFixed(0)}%`,
            anchor: [0, 0],
            x: Background.width / 2,
            style: {
                fill: 0xffffff,
                fontFamily: fontMap['sansFont'],
                fontWeight: '100',
                fontSize: 20,
            },
        })

        return TweenableContainer(
            {
                name: `TopPercentileTag_Container`,
                x: BASE_WIDTH / 2 - 90,
                y: BASE_HEIGHT / 2 + 230,
                alpha: 0,
                scale: 2,
            },
            Background,
            Adjust(HighScoreText, {
                x: Background.width / 2 - HighScoreText.width / 2,
                y: Background.height / 2 - HighScoreText.height / 2,
            })
        )
    }

    const buttonsY = BASE_HEIGHT / 2 + 450

    const TryAgainButton = GradientButton({
        onClick: handleTryAgain,
        text: 'Try Again',
        x: BASE_WIDTH / 2 - 280,
        y: buttonsY,
        fontSize: 35,
        xPadding: 30,
        yPadding: 11,
        outlineColor: 0x002717,
    })

    const ShowLeaderboardButton = GradientButton({
        onClick: () => {
            !mainContainerIsAnimating.val &&
                showLeaderboard.set(!showLeaderboard.val)
        },
        text: 'Leaderboard',
        x: BASE_WIDTH / 2 + 255,
        y: buttonsY,
        fontSize: 35,
        xPadding: 30,
        yPadding: 11,
        gradientFrom: 0xff9534,
        gradientTo: 0xec4f0c,
        outlineColor: 0x330004,
    })

    const CloseModalButton = Sprite({
        src: getTexture('closeButton'),
        scale: 0.75,
        y: BASE_HEIGHT / 2 - 495,
        x: BASE_WIDTH / 2 + 755,
        onClick: () => {
            !mainContainerIsAnimating.val &&
                showLeaderboard.set(!showLeaderboard.val)
        },
    })

    const ScoreElementsBackground = TweenableContainer(
        {
            alpha: 0,
            scale: 0.2,
            x: BASE_WIDTH / 2 - 175,
            y: BASE_HEIGHT / 2 - 175,
        },
        RoundedRectangleGradientSprite({
            spriteArgs: {
                width: 1550,
                height: 765,
                name: 'ScoreElementsBackground',
                // anchor: [0.5, 0.5],
                alpha: 1,
                tint: 1,
            },
            radius: 50,
            gradientArgs: {
                x0: 0,
                x1: 0,
                y0: 0,
                y1: 700,
                colorStops: [
                    { color: 0x0b0b09, offset: 0 },
                    { color: 0x3f4338, offset: 1 },
                ],
            },
        })
    )

    const TogglableMainContainer = Container({})
    const TogglableButtonsContainer = Container({})
    const ScoreElements = Container({})
    const TotalScoreContainer = Container(
        {},
        TopBorder,
        TotalScoreTitle,
        TotalScorePoints
    )

    // can use If datum utilty fn, but need to adapt to using animations
    const handleLeaderboardToggle = async (showLeaderboard: boolean) => {
        await transitionToScreen(
            'out',
            TogglableButtonsContainer,
            TogglableMainContainer
        )

        TogglableMainContainer.removeChildren()
        TogglableButtonsContainer.removeChildren()
        if (showLeaderboard && Leaderboard) {
            TogglableButtonsContainer.addChild(CloseModalButton)
            TogglableMainContainer.addChild(Leaderboard)
        } else {
            TogglableButtonsContainer.addChild(TryAgainButton)
            TogglableButtonsContainer.addChild(ShowLeaderboardButton)
            TogglableMainContainer.addChild(ScoreElementsBackground)
            TogglableMainContainer.addChild(ScoreElements)
            TogglableMainContainer.addChild(TotalScoreContainer)
            TogglableMainContainer.addChild(RunResultBanner)
        }

        await transitionToScreen(
            'in',
            TogglableMainContainer,
            TogglableButtonsContainer
        )
    }

    showLeaderboard.onChange(async showLeaderboard => {
        mainContainerIsAnimating.set(true)
        await handleLeaderboardToggle(showLeaderboard)
        mainContainerIsAnimating.set(false)
    })

    // Runs text animations synchronously
    const runInitialAnimations = async () => {
        const screenHasNotOpened = scene.get('endScreenHasOpened') === false
        const isVictory = scene.get('state') === 'won'
        TogglableMainContainer.addChild(ScoreElementsBackground)
        TogglableMainContainer.addChild(RunResultBanner)
        await slamAnimateElIntoScreen(RunResultBanner)

        // below condition will only be met once (even after refresh)
        if (screenHasNotOpened) {
            await callApi('openEndOfRun', {})
            collectData('level_end', {
                room_number: scene.get('numRoomsPassed'), // no +1 bc it should already be updated
                room_id: scene.get('currentRoom').uid,
                room_tier: scene.get('currentRoom').category,
                run_id: scene.get('runId'),
            })

            collectData('run_end', {
                map_seed: 1,
                run_id: scene.get('runId'),
            })

            if (isVictory) {
                callApi('openEndOfRun', {})
            }

            const { runId } = await callApi('endRun', {
                userId,
            })

            if (runId === null) {
                console.warn('Tried to end run but runId was null')
            }
        }
        const runScoreAttributes = scene.get('runScore').attributes

        for (let attribute in runScoreAttributes) {
            const points =
                runScoreAttributes[attribute as RunScoreAttributeName]
            if (points === 0) continue
            const ScoreAttribute = ScoreAttributeItem(
                attribute as RunScoreAttributeName,
                points
            )
            ScoreElements.addChild(ScoreAttribute)
        }

        // All initial addChild are done manually instead of auto-run on datum change, as otherwise score explanations appear on hover while Defeat Banner is animating
        TogglableMainContainer.addChild(TotalScoreContainer)
        const mappedLeaderboard = await callApi('getLeaderboard', {
            userId,
        })
        Leaderboard = LeaderboardContainer(mappedLeaderboard)
        if (!runId) return
        const { isNewHighScore, topPercentile } = await getScoreTags({
            runId,
            allTimeLeaderboards: mappedLeaderboard.allTime,
        })
        await slideAndFadeOut(RunResultBanner, battleState)
        Adjust(RunResultBanner, {
            y: 0,
            x: BASE_WIDTH / 2 - (RunResultBanner.width / 2) * 0.2 - 50,
            scale: 0.2,
        })
        await expandOut(ScoreElementsBackground)
        await transitionFadeElement(RunResultBanner, 'slow', 'in')
        TogglableMainContainer.addChild(Adjust(ScoreElements, { x: 0, y: 0 }))
        await transitionFadeChildren(ScoreElements, 'sync', 'fast', 'in')
        await transitionFadeChildren(TotalScoreContainer, 'async', 'slow', 'in')
        TogglableButtonsContainer.addChild(TryAgainButton)
        TogglableButtonsContainer.addChild(ShowLeaderboardButton)
        await transitionFadeChildren(
            TogglableButtonsContainer,
            'async',
            'slow',
            'in'
        )
        await animateNumberInElement(
            TotalScorePoints,
            'points',
            scene.select('runScore').get('totalScore'),
            'normal'
        )

        const HighScoreTag = NewHighScoreTag()
        const PercentileTag = TopPercentileTag(topPercentile)
        if (isNewHighScore) {
            TotalScoreContainer.addChild(HighScoreTag)
        }
        if (topPercentile < TOP_PERCENTILE_CUTOFF) {
            TotalScoreContainer.addChild(PercentileTag)
            if (!isNewHighScore) {
                Adjust(PercentileTag, { x: BASE_WIDTH / 2 - 330 })
            }
        }
        await slamAnimateElIntoScreenStatic(HighScoreTag)
        await slamAnimateElIntoScreenStatic(PercentileTag)
        callApi('openEndOfRun', {})
    }

    runInitialAnimations().then(() => {
        console.log('initialAnimations done')
    })

    /** Takes you to character select screen */
    function handleTryAgain() {
        void callApi('setInitialGameState', {
            userId: scene.get('userId'),
        })
    }

    const EndOfRunContainer = Container(
        { x: 0, y: 0, scale: 1, name: 'EndOfRunContainer' },
        ModalBackdrop(),
        TogglableMainContainer,
        TogglableButtonsContainer
    )

    return EndOfRunContainer
}
