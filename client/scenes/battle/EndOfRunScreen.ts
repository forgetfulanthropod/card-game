import { ModalBackdrop } from '@sharedElements'
import {
    getTexture,
    PixiContainer,
    Text,
    TweenableContainer,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Sprite } from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { animateTo } from '../shared/cards/Hand'

const VICTORY_SIGN_FINAL_POS = {
    rotation: 0,
    scale: 1,
    x: 0,
    y: -300,
}

// TODO end of run when user dies (eg. NPC wins)
export function EndOfRunScreen(): PixiContainer {
    const scene = getBattleScene()

    // setTimeout(() => {
    //     animateTo(VictorySign, VICTORY_SIGN_FINAL_POS)
    // }, 2000)

    const VictorySign = TweenableContainer(
        {},
        Sprite({
            src: getTexture('victory'),
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
        y: BASE_HEIGHT / 2,
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
        y: BASE_HEIGHT / 2 + 400,
        style: {
            fontSize: 50,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'bold',
        },
        name: 'TotalScore',
    })

    function handleButtonPress() {
        // restart game (eg. retry)
    }

    function applyOnClick(
        el: PixiContainer | TweenablePixiContainer,
        onClick: () => void
    ) {
        el.interactive = true
        el.cursor = `url('assets/root/hand.webp'), pointer`
        el.on('pointerdown', onClick)
    }

    const EndOfRunContainer = Container(
        { x: 0, y: 0, scale: 1, name: 'EndOfRunContainer' },
        ModalBackdrop(),
        VictorySign,
        EnemiesKilled,
        TotalScore
    )

    return EndOfRunContainer
}
