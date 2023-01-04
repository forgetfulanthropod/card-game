import {
    depricatedScoreUpdateFromClient,
    InfoBox,
    ModalBackdrop,
} from '@sharedElements'
import {
    getStage,
    loopSong,
    PixiContainer,
    PixiText,
    playSongOnce,
    RoundedRectangleGradientSprite,
    TweenablePixiContainer,
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

const getShowOnHoverFns = (el: PixiContainer) => {
    let waitingTimer: NodeJS.Timeout | null = null

    const onMouseover = () => {
        waitingTimer = setTimeout(() => {
            getStage().addChild(el)
        }, 200)
    }

    const onMouseout = () => {
        if (waitingTimer !== null) {
            clearTimeout(waitingTimer)
            getStage().removeChild(el)
        } else {
        }
    }

    return { onMouseover, onMouseout }
}

const animateNumberInElement = async (
    element: PixiText,
    text: string,
    finalNumber: number,
    speed: 'slow' | 'normal' | 'fast' = 'normal'
): Promise<void> => {
    let initialNumber = 0
    const numberIncrement = speed === 'slow' ? 1 : speed === 'normal' ? 2 : 3
    const intervalIncrement =
        speed === 'slow' ? 100 : speed === 'normal' ? 25 : 10

    return await new Promise(resolve => {
        const tempInterval = setInterval(() => {
            element.text = `${initialNumber} ${text}`
            initialNumber += numberIncrement

            if (initialNumber >= finalNumber) {
                element.text = `${finalNumber.toFixed(0)} ${text}`
                clearInterval(tempInterval)
                resolve(void 0)
            }
        }, intervalIncrement)
    })
}

const getPosition = () => {
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

let itemsOnScreen = 0
const ScoreAttributeItem = (
    attribute: RunScoreAttributeName,
    score: number
) => {
    itemsOnScreen++

    const { x, y } = getPosition()
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
        text: `${score * pointValue} pts`,
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
            fill: '#BDCCD4',
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

export function EndOfRunScreen(): PixiContainer {
    gtag('event', 'ui_ux_view', { page_title: 'End of Run Screen' })

    const scene = getBattleScene()
    const battleState = scene.get('state')

    battleState === 'won'
        ? loopSong('runVictoryMusicHooligansBluff')
        : loopSong('defeatMusicHooligansBluff')

    const RunResultBanner = TweenableContainer(
        {},
        Sprite({
            src: getTexture(`${battleState === 'won' ? 'victory' : 'defeat'}`),
            alpha: 1,
            scale: 0.35,
            x: BASE_WIDTH / 2,
            y: BASE_HEIGHT / 2 - 360,
            anchor: [0.5, 0.5],
        })
    )

    const runScoreAttributes = scene.get('runScore').attributes
    const runScorePixiElements: TweenablePixiContainer[] = []
    for (let attribute in runScoreAttributes) {
        const points = runScoreAttributes[attribute as RunScoreAttributeName]
        if (points === 0) continue
        const ScoreAttribute = ScoreAttributeItem(
            attribute as RunScoreAttributeName,
            points
        )
        runScorePixiElements.push(ScoreAttribute)
    }

    const TotalScoreTitle = Text({
        text: `Total Score`,
        anchor: [0, 0.5],
        x: BASE_WIDTH / 2 - 500,
        y: BASE_HEIGHT / 2 + 265,
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

    const TopBorder = Sprite({
        src: Texture.WHITE,
        width: 1000,
        height: 2,
        x: BASE_WIDTH / 2 - 500,
        y: BASE_HEIGHT / 2 + 210,
        anchor: [0, 0.5],
        alpha: 0.1,
    })

    const TotalScoreContainer = Container(
        {},
        TopBorder,
        TotalScoreTitle,
        TotalScore
    )

    // Runs text animations synchronously
    ;(async () => {
        const screenHasNotOpened = scene.get('endScreenHasOpened') === false
        const isVictory = scene.get('state') === 'won'

        // below condition will only be met once (even after refresh)
        if (screenHasNotOpened) {
            gtag('event', 'level_end', {
                room_number: scene.get('numRoomsPassed'), // no +1 bc it should already be updated
                room_id: scene.get('currentRoom').uid,
                room_tier: scene.get('currentRoom').category,
                run_id: scene.get('runId'),
            })

            gtag('event', 'run_end', {
                map_seed: 1,
                run_id: scene.get('runId'),
            })

            if (isVictory) {
                depricatedScoreUpdateFromClient('ROOM_CLEARED', 1, scene)
                callApi('openEndScreen', {})
            }

            const { runId } = await callServerApi('endRun', {
                userId: scene.get('username'),
            })
            if (runId === null) {
                console.warn('Tried to end run but runId was null')
            }
        }

        await animateNumberInElement(
            TotalScore,
            'points',
            scene.select('runScore').get('totalScore'),
            'normal'
        )
        callApi('openEndScreen', {})
    })()

    const tryAgainButton = Sprite({
        src: getTexture('tryAgainButton'),
        anchor: 0,
        y: BASE_HEIGHT / 2 + 380,
        x: BASE_WIDTH / 2 - 185,
        scale: 0.6,
        onClick: handleButtonPress,
    })

    /** Takes you to character select screen */
    function handleButtonPress() {
        void callApi('makeNewUser', {
            username: localStorage.getItem('username') as string,
        })
        window.location.reload()
    }

    const RoundedBlackRectBackground = RoundedRectangleGradientSprite({
        spriteArgs: {
            width: 1100,
            height: 525,
            x: BASE_WIDTH / 2,
            y: BASE_HEIGHT / 2 + 65,
            name: 'RoundedBlackRectBackground',
            anchor: [0.5, 0.5],
            alpha: 0.6,
            tint: 1,
        },
        radius: 50,
        gradientArgs: {
            x0: 0,
            x1: 500,
            y0: 0,
            y1: 500,
            colorStops: [
                { color: 'black', offset: 0 },
                { color: 'white', offset: 1 },
            ],
        },
    })

    const lootElementsWithBg = Container(
        {},
        RoundedBlackRectBackground,
        ...runScorePixiElements
    )

    const EndOfRunContainer = Container(
        { x: 0, y: 0, scale: 1, name: 'EndOfRunContainer' },
        ModalBackdrop(),
        lootElementsWithBg,
        RunResultBanner,
        TotalScoreContainer,
        tryAgainButton
    )

    return EndOfRunContainer
}
