import { handleScoringEvent, ModalBackdrop } from '@sharedElements'
import {
    loopSong,
    PixiContainer,
    PixiText,
    playSongOnce,
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

const VICTORY_SIGN_FINAL_POS = {
    rotation: 0,
    scale: 1,
    x: 0,
    y: -300,
}

// TODO: display both quantity & score value, animate only score value (eg. something like "Rooms Passed (5) = 50") and animate 50, assuming each room is worth 10 points
// TODO: align the text to the left, score to the right on separate columns

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
            element.text = `${text}:    ${initialNumber}`
            initialNumber += numberIncrement

            if (initialNumber >= finalNumber) {
                element.text = `${text}:    ${finalNumber}`
                clearInterval(tempInterval)
                resolve(void 0)
            }
        }, intervalIncrement)
    })
}

export function EndOfRunScreen(): PixiContainer {
    const scene = getBattleScene()
    const battleState = scene.get('state')

    battleState === 'won'
        ? loopSong('runVictoryMusicHooligansBluff')
        : loopSong('defeatMusicHooligansBluff')

    const VictorySign = TweenableContainer(
        {},
        Sprite({
            src: getTexture(`${battleState === 'won' ? 'victory' : 'defeat'}`),
            alpha: 1,
            scale: 0.4,
            x: BASE_WIDTH / 2,
            y: BASE_HEIGHT / 2 - 300,
            anchor: [0.5, 0.5],
        })
    )

    const EnemiesKilled = Text({
        text: ``,
        anchor: [0.5, 0.5],
        x: BASE_WIDTH / 2 - 200,
        y: BASE_HEIGHT / 2 - 50,
        style: {
            fontSize: 30,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
            fontFamily: 'bigFont',
        },
        name: 'EnemiesKilled',
    })

    const RoomsCleared = Text({
        text: ``,
        anchor: [0.5, 0.5],
        x: BASE_WIDTH / 2 - 200,
        y: BASE_HEIGHT / 2,
        style: {
            fontSize: 30,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
            fontFamily: 'bigFont',
        },
        name: 'RoomsCleared',
    })

    const BossesKilled = Text({
        text: ``,
        anchor: [0.5, 0.5],
        x: BASE_WIDTH / 2 - 200,
        y: BASE_HEIGHT / 2 + 50,
        style: {
            fontSize: 30,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
            fontFamily: 'bigFont',
        },
        name: 'Bosses Killed',
    })

    const TotalScore = Text({
        text: ``,
        anchor: [0.5, 0.5],
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT / 2 + 175,
        style: {
            fontSize: 50,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'bigFont',
        },
        name: 'TotalScore',
    })

    const CumulativeOverkill = Text({
        text: ``,
        anchor: [0.5, 0.5],
        x: BASE_WIDTH / 2 + 200,
        y: BASE_HEIGHT / 2 + 50,
        style: {
            fontSize: 30,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
            fontFamily: 'bigFont',
        },
        name: `TotalResourcesCollected`,
    })

    const totalResourcesCount = scene
        .select('lootClaimed')
        .get()
        .reduce((acc, loot) => acc + loot.count, 0)

    const TotalResourcesCollected = Text({
        text: ``,
        anchor: [0.5, 0.5],
        x: BASE_WIDTH / 2 + 200,
        y: BASE_HEIGHT / 2 - 50,
        style: {
            fontSize: 30,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
            fontFamily: 'bigFont',
        },
        name: `TotalResourcesCollected`,
    })

    const DeckSize = Text({
        text: ``,
        anchor: [0.5, 0.5],
        x: BASE_WIDTH / 2 + 200,
        y: BASE_HEIGHT / 2,
        style: {
            fontSize: 30,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
            fontFamily: 'bigFont',
        },
        name: `TotalResourcesCollected`,
    })

    const numRoomsPassed = scene.get('numRoomsPassed')
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
        await animateNumberInElement(
            EnemiesKilled,
            'Enemies Killed',
            scene.select('runScore').select('attributes').get('enemiesKilled'),
            'slow'
        )
        await animateNumberInElement(
            RoomsCleared,
            'Rooms Cleared',
            numRoomsPassed,
            'slow'
        )
        await animateNumberInElement(BossesKilled, 'Bosses Killed', 0, 'slow')
        await animateNumberInElement(
            TotalResourcesCollected,
            'Loot Earned',
            totalResourcesCount,
            'fast'
        )
        await animateNumberInElement(DeckSize, 'Card Deck Size', 0, 'slow')
        await animateNumberInElement(
            CumulativeOverkill,
            'Cumulative Overkill',
            0,
            'fast'
        )
        await animateNumberInElement(
            TotalScore,
            'Total Score',
            totalScore,
            'fast'
        )
        callApi('openEndScreen', {})
    })()

    const tryAgainButton = Sprite({
        src: getTexture('tryAgainButton'),
        anchor: 0,
        y: BASE_HEIGHT / 2 + 275,
        x: BASE_WIDTH / 2 - 185,
        scale: (1920 * 0.18) / getTexture('goButton').width,
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
            width: 800,
            height: 350,
            x: BASE_WIDTH / 2,
            y: BASE_HEIGHT / 2 + 65,
            name: 'RoundedBlackRectBackground',
            anchor: [0.5, 0.5],
            alpha: 0.6,
            tint: 1,
        },
        radius: 100,
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
        EnemiesKilled,
        RoomsCleared,
        BossesKilled,
        // ...lootElementsLeft,
        TotalResourcesCollected,
        CumulativeOverkill,
        DeckSize
    )

    const EndOfRunContainer = Container(
        { x: 0, y: 0, scale: 1, name: 'EndOfRunContainer' },
        ModalBackdrop(),
        VictorySign,
        lootElementsWithBg,
        TotalScore,
        tryAgainButton
    )

    return EndOfRunContainer
}
