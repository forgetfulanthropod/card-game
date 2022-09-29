import { ModalBackdrop } from '@sharedElements'
import type { PixiContainer } from '@/elementsUtil'
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

// TODO end of run when user dies (eg. NPC wins)
export function DefeatScreen(): PixiContainer {
    const scene = getBattleScene()

    const DefeatSign = TweenableContainer(
        {},
        Sprite({
            src: getTexture('defeat'),
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
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT / 2 - 50,
        style: {
            fontSize: 35,
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
        y: BASE_HEIGHT / 2 + 25,
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
        y: BASE_HEIGHT / 2 + 175,
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
        y: BASE_HEIGHT / 2 + 200,
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

    const EndOfRunContainer = Container(
        { x: 0, y: 0, scale: 1, name: 'EndOfRunContainer' },
        ModalBackdrop(),
        DefeatSign,
        EnemiesKilled,
        TotalScore,
        Retry,
        retryButton
    )

    return EndOfRunContainer
}
