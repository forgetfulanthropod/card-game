import {
    depricatedScoreUpdateFromClient,
    InfoBox,
    ModalBackdrop,
} from '@sharedElements'
import {
    Adjust,
    animateNumberInElement,
    getShowOnHoverFns,
    loopSong,
    PixiContainer,
    RoundedRectangleGradientSprite,
} from '@/elementsUtil'
import {
    getTexture,
    Text,
    TweenableContainer,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    Sprite,
} from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { callApi } from '@/callApi'
import {
    RunScoreAttributeName,
    RUN_SCORE_EVENT_MAPPING,
    RUN_SCORE_EVENT_META,
} from 'shared'
import { ITextStyle, Texture } from 'pixi.js'
import { callServerApi } from '@/callServerApi'
import { round } from 'lodash'
import { collectData } from '@/analytics/collectData'
import { datum } from 'datums'
import { LeaderboardContainer } from './Leaderboards'

let itemsOnScreen = 0
const getScoreItemPosition = () => {
    const ITEMS_PER_COLUMN = 9

    const leftColumnX = BASE_WIDTH / 2 - 500
    const rightColumnX = BASE_WIDTH / 2 + 50
    const x = itemsOnScreen <= ITEMS_PER_COLUMN ? leftColumnX : rightColumnX

    const Y_MARGIN = 38
    const Y_BASE = BASE_HEIGHT / 2 - 180
    const y =
        itemsOnScreen <= ITEMS_PER_COLUMN
            ? Y_BASE + Y_MARGIN * itemsOnScreen
            : Y_BASE + Y_MARGIN * (itemsOnScreen - ITEMS_PER_COLUMN)

    return { x, y }
}

const baseStyle: Partial<ITextStyle> = {
    fontSize: 24,
    fill: 'white',
    padding: 4,
    align: 'center',
    fontWeight: 'lighter',
    fontFamily: 'bigFont',
}

const ScoreAttributeItem = (
    attribute: RunScoreAttributeName,
    score: number
) => {
    itemsOnScreen++

    const { x, y } = getScoreItemPosition()
    const attributeEvent =
        RUN_SCORE_EVENT_MAPPING[attribute as RunScoreAttributeName]

    const { keyword, description, pointValue } =
        RUN_SCORE_EVENT_META[attributeEvent]

    const descriptionSubtitle = `${pointValue} ${
        pointValue === 1 ? 'point' : 'points'
    } per unit`

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
        x: x + 425,
        y,
        style: {
            ...baseStyle,
            fontFamily: 'sansFont',
        },
        name: `${attribute}_score`,
    })

    const ExplanationTitle = Text({
        text: description,
        x: 15,
        y: 10,
        style: {
            ...baseStyle,
            fill: '#c5e0ef',
        },
    })
    const ExplanationSubtitle = Text({
        text: descriptionSubtitle,
        x: 15,
        y: 40,
        style: {
            ...baseStyle,
            fontSize: 20,
            fontFamily: 'sansFont',
            fontStyle: 'italic',
        },
    })

    const ExplanationInfoBox = InfoBox(
        Container({}, ExplanationTitle, ExplanationSubtitle),
        {
            x: x + Title.width + 25,
            y: y - 24,
            name: `${keyword} Explanation`,
            zIndex: 999,
            padding: 8,
            borderColor: 0x44403c,
            colorStops: [{ color: 0x57534e, offset: 0 }],
            alpha: 0.95,
        }
    )

    const { onMouseout, onMouseover } = getShowOnHoverFns(ExplanationInfoBox)

    const ScoreItemContainer = TweenableContainer(
        { onMouseover, onMouseout },
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
    const userId = scene.get('username')

    battleState === 'won'
        ? loopSong('runVictoryMusicHooligansBluff')
        : loopSong('defeatMusicHooligansBluff')

    // --- Pixi Elements ---
    const RunResultBanner = () => {
        const src = getTexture(
            `${battleState === 'won' ? 'victory' : 'defeat'}`
        )
        const scale = 0.35
        return TweenableContainer(
            {},
            Sprite({
                src,
                scale,
                x: BASE_WIDTH / 2 - (src.width * scale) / 2,
                y: BASE_HEIGHT / 2 - 550,
            })
        )
    }

    const TotalScoreTitle = Text({
        text: `Total Score`,
        anchor: [0, 0.5],
        x: BASE_WIDTH / 2 - 500,
        y: BASE_HEIGHT / 2 + 262,
        style: {
            fontSize: 64,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'bigFont',
        },
        name: 'TotalScoreTitle',
    })

    const TotalScore = Text({
        text: ``,
        anchor: [1, 0.5],
        x: BASE_WIDTH / 2 + 450,
        y: BASE_HEIGHT / 2 + 265,
        style: {
            fontSize: 50,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
            fontFamily: 'sansFont',
        },
        name: 'TotalScore',
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
                    { color: 0x3BA1BA, offset: 1 }
                ],
            },
        })

        const HighScoreText = Text({
            text: '🎉  New High Score!',
            anchor: [0, 0],
            x: Background.width / 2,
            style: {
                fill: 0xFFFFFF,
                fontFamily: 'sansFont',
                fontWeight: '300',
                fontSize: 20,
            },
        })

        return Container(
            {
                name: `HighScoreTag_Container`,
                x: BASE_WIDTH / 2 + 280,
                y: BASE_HEIGHT / 2 + 242,
            },
            Background,
            Adjust(HighScoreText, {
                x: Background.width / 2 - HighScoreText.width / 2,
                y: Background.height / 2 - HighScoreText.height / 2,
            })
        )
    }

    const TopPercentileTag = () => {
        const Background = RoundedRectangleGradientSprite({
            spriteArgs: {
                width: 150,
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
                    { color: 0x4FA003, offset: 0 },
                    { color: 0x3A762E, offset: 1 }
                ],
            },
        })

        const HighScoreText = Text({
            text: '🚀  Top 1%',
            anchor: [0, 0],
            x: Background.width / 2,
            style: {
                fill: 0xFFFFFF,
                fontFamily: 'sansFont',
                fontWeight: '100',
                fontSize: 20,
            },
        })

        return Container(
            {
                name: `TopPercentileTag_Container`,
                x: BASE_WIDTH / 2 + 280,
                y: BASE_HEIGHT / 2 + 242,
            },
            Background,
            Adjust(HighScoreText, {
                x: Background.width / 2 - HighScoreText.width / 2,
                y: Background.height / 2 - HighScoreText.height / 2,
            })
        )
    }

    const TopBorder = Sprite({
        src: Texture.WHITE,
        width: 1000,
        height: 2,
        x: BASE_WIDTH / 2 - 500,
        y: BASE_HEIGHT / 2 + 210,
        anchor: [0, 0.5],
        alpha: 0.1,
    })

    const TryAgainButton = Sprite({
        src: getTexture('tryAgainButton'),
        anchor: 0,
        y: BASE_HEIGHT / 2 + 380,
        x: BASE_WIDTH / 2 - 400,
        scale: 0.6,
        onClick: handleTryAgain,
    })

    const ShowLeaderboardButton = Sprite({
        src: getTexture('leaderboardButton'),
        anchor: 0,
        y: BASE_HEIGHT / 2 + 380,
        x: BASE_WIDTH / 2 + 75,
        scale: 0.6,
        onClick: () => {
            showLeaderboard.set(!showLeaderboard.val)
        },
    })

    const CloseModalButton = Sprite({
        src: getTexture('closeButton'),
        // anchor: [0.5, 0.5],
        y: BASE_HEIGHT / 2 - 445,
        x: BASE_WIDTH / 2 + 755,
        onClick: () => {
            showLeaderboard.set(!showLeaderboard.val)
        },
    })

    const ScoreElementsBackground = RoundedRectangleGradientSprite({
        spriteArgs: {
            width: 1100,
            height: 525,
            x: BASE_WIDTH / 2,
            y: BASE_HEIGHT / 2 + 65,
            name: 'ScoreElementsBackground',
            anchor: [0.5, 0.5],
            alpha: 0.6,
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

    const TogglableMainContainer = Container({})
    const TogglableButtonsContainer = Container({})
    const ScoreElements = Container({}, ScoreElementsBackground)
    const TotalScoreContainer = Container(
        {},
        TopBorder,
        TotalScoreTitle,
        TotalScore
    )
    const Leaderboard = LeaderboardContainer()

    const handleLeaderboardToggle = (showLeaderboard: boolean) => {
        TogglableMainContainer.removeChildren()
        TogglableButtonsContainer.removeChildren()

        if (showLeaderboard) {
            TogglableButtonsContainer.addChild(CloseModalButton)
            TogglableMainContainer.addChild(Leaderboard)
        } else {
            TogglableMainContainer.addChild(ScoreElements)
            TogglableMainContainer.addChild(TotalScoreContainer)
            TogglableMainContainer.addChild(RunResultBanner())
            TogglableButtonsContainer.addChild(TryAgainButton)
            TogglableButtonsContainer.addChild(ShowLeaderboardButton)
            Adjust(ShowLeaderboardButton, { x: BASE_WIDTH / 2 + 75 })
        }
    }

    showLeaderboard.onChange(showLeaderboard => {
        handleLeaderboardToggle(showLeaderboard)
    }, true)

    // Runs text animations synchronously
    const runInitialAnimations = async () => {
        const screenHasNotOpened = scene.get('endScreenHasOpened') === false
        const isVictory = scene.get('state') === 'won'

        // below condition will only be met once (even after refresh)
        if (screenHasNotOpened) {
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
                depricatedScoreUpdateFromClient('ROOM_CLEARED', 1, scene)
                callApi('openEndOfRun', {})
            }

            const { runId } = await callServerApi('endRun', {
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

        await animateNumberInElement(
            TotalScore,
            'points',
            scene.select('runScore').get('totalScore'),
            'normal'
        )
        callApi('openEndOfRun', {})
    }

    runInitialAnimations().then(() => {
        console.log('initialAnimations done')
    })

    /** Takes you to character select screen */
    function handleTryAgain() {
        void callApi('makeNewUser', {
            username: localStorage.getItem('username') as string,
        })
        window.location.reload()
    }

    const EndOfRunContainer = Container(
        { x: 0, y: 0, scale: 1, name: 'EndOfRunContainer' },
        ModalBackdrop(),
        TogglableMainContainer,
        TogglableButtonsContainer
    )

    return EndOfRunContainer
}
