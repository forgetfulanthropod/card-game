import type { PixiContainer } from '@/elementsUtil'
import {
    getTexture,
    Sprite,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
} from '@/elementsUtil'

// const arrowStyle = {
//     fontFamily: 'bigFont',
//     fontSize: 80,
//     // fill: ['#fff', '#eee'], // gradient
//     fill: ['#aaa'],
//     stroke: '#999',
//     strokeThickness: 5,
// }

export function LevelInfo(): PixiContainer {
    // const scene = getEntryScene()

    // const level = scene.select('selectedLevel').get()

    const root = Container(
        {
            x: BASE_WIDTH * 0.15,
            y: BASE_HEIGHT * 0.85,
            // children: [leftButton, levelNumText, rightButton, levelNameText],
        },
        Sprite({
            src: 'skelepitDungeonSign',
            anchor: 0.5,
            scale:
                (BASE_WIDTH * 0.3) /
                (getTexture('skelepitDungeonSign')?.width ?? 1000),
        })
    )

    return root

    // ALPHA NO LEVELS!
    // scene.select('selectedLevel').on('update', () => {

    // const selectedLevel = scene.get().selectedLevel ?? {}

    // levelNumText.text = `Level ${selectedLevel.num}`
    // levelNameText.text = selectedLevel.name
    // })

    // const levelNumText = Text({
    //     text: `Level ${level?.num}`,
    //     anchor: [0.5, 1],
    //     style: {
    //         fontFamily: 'bigFont',
    //         fontSize: 60,
    //         fill: ['#fff', '#eee'], // gradient
    //         // letterSpacing: -5,
    //         stroke: '#999',
    //         strokeThickness: 5,
    //     },
    // })

    // const leftButton = Text({
    //     text: '◀',
    //     anchor: [0.5, 1],
    //     x: -300,
    //     y: 0,
    //     style: arrowStyle,
    //     alpha: 0,
    //     async onClick() {
    //         await callApi('changeDungeon', { direction: -1 })
    //     },
    // })
    // const rightButton = Text({
    //     text: '▶',
    //     anchor: [0.5, 1],
    //     x: 300,
    //     y: 0,
    //     style: arrowStyle,
    //     alpha: 0,
    //     async onClick() {
    //         await callApi('changeDungeon', { direction: +1 })
    //     },
    // })

    // const levelNameText = Text({
    //     text: `${level?.name}`,
    //     anchor: [0.5, 0],
    //     style: {
    //         fontFamily: 'bigFont',
    //         fontSize: 45,
    //         fill: '#fff',
    //         stroke: '#000',
    //         strokeThickness: 8,
    //     },
    // })
}
