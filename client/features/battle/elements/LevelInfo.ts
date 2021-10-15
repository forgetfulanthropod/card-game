import { numbers } from '@/data/battle/constants'
import { getEntryScene } from '@/data/rootTree'
import { changeDungeon } from '@@/logic/dungeonEntry'
import { Container, PixiContainer, Text } from './mypixi'


export function LevelInfo(): PixiContainer {

    const scene = getEntryScene()

    scene.select('selectedLevel').on('update', () => {
        const selectedLevel = scene.get().selectedLevel

        levelNumText.text = `Level ${selectedLevel.num}`
        levelNameText.text = selectedLevel.name
        pointLimitText.text = `point limit: ${selectedLevel.pointLimit}`
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
            stroke: '#999',
            strokeThickness: 5,
        },
        onClick() {
            changeDungeon(-1)
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
            stroke: '#999',
            strokeThickness: 5,
        },
        onClick() {
            changeDungeon(+1)
        }
    })

    const levelNameText = Text({
        text: 'Hooligan’s Bluff',
        anchor: [.5, 0],
        y: 20,
        style: {
            fontFamily: 'VT323',
            fontSize: 60,
            fill: '#fff',
        },
    })

    const pointLimitText = Text({
        text: 'point limit: 20',
        anchor: [.5, 0],
        y: 80,
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
            levelNameText,
            pointLimitText,
        ],
    })


    return root
}
