import { numbers } from '@/data/battle/constants'
import { getEntryScene } from '@/data/rootTree'
import { Container, PixiContainer, PixiText, Text } from './mypixi'


export function LevelInfo(): PixiContainer {

    const levels = [
        { name: 'Hooligan’s Bluff', pointLimit: 20, modifier: 1, },
        { name: 'The Matcha Caves', pointLimit: 40, modifier: 2, },
        { name: 'Fort Skeleton', pointLimit: 65, modifier: 3, },
        { name: 'The Ninth Trash Hole of Hell', pointLimit: 100, modifier: 5, },
    ]

    const scene = getEntryScene()

    scene.on('update', () => {
        const selectedLevel = scene.get().selectedLevel
        const levelIndex = selectedLevel - 1
        const level = levels[levelIndex]

        levelNumText.text = `Level ${selectedLevel}`
        pointLimitText.text = `point limit: ${level.pointLimit}`
    })

    const levelNumText = Text({
        text: 'Level 1',
        anchor: [.5, 1],
        style: {
            fontFamily: 'VT323',
            fontSize: 80,
            fill: ['#fff', '#eee'], // gradient
            // letterSpacing: -5,
            stroke: '#999',
            strokeThickness: 5,
        },
    })

    const leftButton = Text({
        text: '◀',
        anchor: [.5, 1],
        x: -300,
        style: {
            fontFamily: 'VT323',
            fontSize: 80,
            fill: ['#fff', '#eee'], // gradient
            // letterSpacing: -5,
            stroke: '#999',
            strokeThickness: 5,
        },
        onClick() {
            let l = scene.select('selectedLevel').get()

            if (l === 1) {
                l = levels.length
            } else {
                l -= 1
            }

            scene.select('selectedLevel').set(l)
            scene.select('pointLimit').set(levels[l - 1].pointLimit)
        }
    })
    const rightButton = Text({
        text: '▶',
        anchor: [.5, 1],
        x: 300,
        style: {
            fontFamily: 'VT323',
            fontSize: 80,
            fill: ['#fff', '#eee'], // gradient
            // letterSpacing: -5,
            stroke: '#999',
            strokeThickness: 5,
        },
        onClick() {
            const l = scene.select('selectedLevel').get()

            scene.select('selectedLevel').set(l % levels.length + 1)
            scene.select('pointLimit').set(levels[l - 1].pointLimit)
        }
    })

    const pointLimitText = Text({
        text: 'point limit: 20',
        anchor: [.5, 0],
        y: 20,
        style: {
            fontFamily: 'VT323',
            fontSize: 30,
            fill: '#fff',
        },
    })

    const root = Container({
        x: numbers.BASE_WIDTH / 2,
        y: numbers.BASE_HEIGHT / 10,
        children: [
            leftButton,
            levelNumText,
            rightButton,
            pointLimitText,
        ],
    })


    return root
}
