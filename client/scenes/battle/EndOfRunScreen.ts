import { ModalBackdrop } from '@sharedElements'
import { PixiContainer, RoundedRectangleGradientSprite } from '@/elementsUtil'
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
import { LootFromGame } from 'shared'
import { upperFirst } from 'lodash'

const VICTORY_SIGN_FINAL_POS = {
    rotation: 0,
    scale: 1,
    x: 0,
    y: -300,
}

// TODO end of run when user dies (eg. NPC wins)
export function EndOfRunScreen(): PixiContainer {
    const scene = getBattleScene()
    const battleState = scene.get('state')
    // setTimeout(() => {
    //     animateTo(VictorySign, VICTORY_SIGN_FINAL_POS)
    // }, 2000)

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
        text: `Enemies Killed: ${scene
            .select('runScore')
            .select('attributes')
            .get('grind')}`,
        anchor: [0.5, 0.5],
        x: BASE_WIDTH / 2 - 200,
        y: BASE_HEIGHT / 2 - 50,
        style: {
            fontSize: 30,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
        },
        name: 'EnemiesKilled',
    })

    const Placeholder = Text({
        text: `Placeholder: 0`,
        anchor: [0.5, 0.5],
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT / 2 - 50,
        style: {
            fontSize: 30,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
        },
        name: 'EnemiesKilled',
    })

    const TotalScore = Text({
        text: `Total Score: ${scene.select('runScore').get('totalScore')}`,
        anchor: [0.5, 0.5],
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT / 2 + 175,
        style: {
            fontSize: 50,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'bold',
        },
        name: 'TotalScore',
    })

    const Retry = Text({
        text: `Retry?`,
        anchor: [0.5, 0.5],
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT / 2 + 250,
        style: {
            fontSize: 40,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'bold',
        },
        name: 'Retry',
    })

    const retryButton = Sprite({
        src: getTexture('goButton'),
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

    const lootClaimedLeft: LootFromGame[] = ['fish', 'stone']

    const lootClaimedRight: LootFromGame[] = ['copper', 'gold', 'wood']

    let lootElementsInitialY = BASE_HEIGHT / 2 - 50
    const lootElementsLeft = lootClaimedLeft.map(item => {
        let totalCount = 0
        scene.get('lootClaimed').forEach(loot => {
            if (loot.name === item) {
                totalCount += loot.count
            }
        })

        return Text({
            text: `${upperFirst(item)} Collected: ${totalCount}`,
            anchor: [0.5, 0.5],
            x: BASE_WIDTH / 2 - 200,
            y: (lootElementsInitialY += 50),
            style: {
                fontSize: 30,
                fill: 'white',
                padding: 4,
                align: 'center',
                fontWeight: 'lighter',
            },
            name: `${item}CountText`,
        })
    })

    lootElementsInitialY = BASE_HEIGHT / 2 - 100

    const lootElementsRight = lootClaimedRight.map(item => {
        let totalCount = 0
        scene.get('lootClaimed').forEach(loot => {
            if (loot.name === item) {
                totalCount += loot.count
            }
        })

        return Text({
            text: `${upperFirst(item)} Collected: ${totalCount}`,
            anchor: [0.5, 0.5],
            x: BASE_WIDTH / 2 + 200,
            y: (lootElementsInitialY += 50),
            style: {
                fontSize: 30,
                fill: 'white',
                padding: 4,
                align: 'center',
                fontWeight: 'lighter',
            },
            name: `${item}CountText`,
        })
    })

    const RoundedBlackRectBackground = RoundedRectangleGradientSprite({
        spriteArgs: {
            width: 800,
            height: 200,
            x: BASE_WIDTH/2,
            y: (lootElementsInitialY) - 50 ,
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
        ...lootElementsLeft,
        ...lootElementsRight
    )

    const EndOfRunContainer = Container(
        { x: 0, y: 0, scale: 1, name: 'EndOfRunContainer' },
        ModalBackdrop(),
        VictorySign,
        lootElementsWithBg,
        TotalScore,
        Retry,
        retryButton
    )

    return EndOfRunContainer
}
