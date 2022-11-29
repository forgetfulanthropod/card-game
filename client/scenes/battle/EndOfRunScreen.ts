import { handleScoringEvent, ModalBackdrop } from '@sharedElements'
import {
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
import { RunScoreAttributeName, RUN_SCORE_EVENT_MAPPING, RUN_SCORE_EVENT_META } from 'shared'
import { Texture } from 'pixi.js'

const VICTORY_SIGN_FINAL_POS = {
    rotation: 0,
    scale: 1,
    x: 0,
    y: -300,
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
            element.text = `${initialNumber}`
            initialNumber += numberIncrement

            if (initialNumber >= finalNumber) {
                element.text = `${finalNumber.toFixed(0)}`
                clearInterval(tempInterval)
                resolve(void 0)
            }
        }, intervalIncrement)
    })
}

let itemsOnScreen = 0
const createScoreCategoryItem = (
    name: string,
    score: number
) => {
    itemsOnScreen++

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

    const { x, y } = getPosition()

    const Title = Text({
        text: name,
        anchor: [0, 0.5],
        x,
        y,
        style: {
            fontSize: 24,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
            fontFamily: 'bigFont',
        },
        name,
    })

    const Points = Text({
        text: `${score}`,
        anchor: [1, 0.5],
        x: x + 425,
        y,
        style: {
            fontSize: 24,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
            fontFamily: 'sansFont',
        },
        name: `${name}_score`,
    })

    return TweenableContainer({ }, Title, Points)
}

export function EndOfRunScreen(): PixiContainer {
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
        const attributeEvent = RUN_SCORE_EVENT_MAPPING[attribute as RunScoreAttributeName]
        const description = RUN_SCORE_EVENT_META[attributeEvent].shortDescription

        const element = createScoreCategoryItem(
            description,
            points
        )
        runScorePixiElements.push(element)
    }

    const TotalScoreTitle = Text({
        text: `Total Score`,
        anchor: [0, 0.5],
        x: BASE_WIDTH / 2 - 500,
        y: BASE_HEIGHT / 2 + 265,
        style: {
            fontSize: 50,
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
        anchor: [0, 0.5],
        x: BASE_WIDTH / 2 + 400,
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
        height: 3,
        x: BASE_WIDTH / 2 - 500,
        y: BASE_HEIGHT / 2 + 200,
        anchor: [0, 0.5],
    })

    const TotalScoreContainer = Container(
        {},
        TopBorder,
        TotalScoreTitle,
        TotalScore
    )

    const totalScore = scene.select('runScore').get('totalScore') // currently bugged - value is retrieved before it's finished updating. maybe can call API to refresh before getting it

    // Runs text animations synchronously
    ;(async () => {
        // if state has not transitioned, then
        if (
            scene.get('endScreenHasOpened') === false &&
            scene.get('state') === 'won'
        ) {
            handleScoringEvent('ROOM_CLEARED', 1, scene)
            callApi('openEndScreen', {})
        }
        await animateNumberInElement(TotalScore, '', totalScore, 'fast')
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

    function handleButtonPress() {
        void callApi('makeNewUser', {
            username: localStorage.getItem('username') as string,
        })
        localStorage.removeItem('username')
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
