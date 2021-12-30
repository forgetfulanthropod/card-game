import { changeDungeon } from '@/actions'
import { getEntryScene } from '@/data/rootTree'
import type { PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Text } from '@/elementsUtil'

export function LevelInfo(): PixiContainer {
    const scene = getEntryScene()

    const level = scene.select('selectedLevel').get()

    scene.select('selectedLevel').on('update', () => {
        const selectedLevel = scene.get().selectedLevel ?? {}

        levelNumText.text = `Level ${selectedLevel.num}`
        levelNameText.text = selectedLevel.name
        pointLimitText.text = `point limit: ${selectedLevel.pointLimit}`
    })

    const levelNumText = Text({
        text: `Level ${level?.num}`,
        anchor: [0.5, 1],
        style: {
            fontFamily: 'VT323',
            fontSize: 60,
            fill: ['#fff', '#eee'], // gradient
            // letterSpacing: -5,
            stroke: '#999',
            strokeThickness: 5,
        },
    })

    const leftButton = Text({
        text: '◀',
        anchor: [0.5, 1],
        x: -300,
        y: 0,
        style: {
            fontFamily: 'VT323',
            fontSize: 80,
            fill: ['#fff', '#eee'], // gradient
            stroke: '#999',
            strokeThickness: 5,
        },
        async onClick() {
            await changeDungeon({ direction: -1 })
        },
    })
    const rightButton = Text({
        text: '▶',
        anchor: [0.5, 1],
        x: 300,
        y: 0,
        style: {
            fontFamily: 'VT323',
            fontSize: 80,
            fill: ['#fff', '#eee'], // gradient
            stroke: '#999',
            strokeThickness: 5,
        },
        async onClick() {
            await changeDungeon({ direction: +1 })
        },
    })

    const levelNameText = Text({
        text: `${level?.name}`,
        anchor: [0.5, 0],
        y: 25,
        style: {
            fontFamily: 'VT323',
            fontSize: 45,
            fill: '#fff',
            stroke: '#999',
            strokeThickness: 5,
        },
    })

    const pointLimitText = Text({
        text: `point limit: ${level?.pointLimit}`,
        anchor: [0.5, 0],
        y: 90,
        style: {
            fontFamily: 'VT323',
            fontSize: 30,
            fill: '#fff',
            stroke: '#999',
            strokeThickness: 5,
        },
    })

    const root = Container({
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT / 10,
        children: [
            leftButton,
            levelNumText,
            rightButton,
            levelNameText,
            pointLimitText,
        ],
    })

    return root
}
