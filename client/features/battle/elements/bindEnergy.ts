import type { ROCursor } from 'sbaobab'
import type { BattleScene } from 'shared'

import { getTexture } from './logic'
import type { PixiContainer } from '@/elementsUtil'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Sprite,
    Text,
    Container,
    clearContainer,
} from '@/elementsUtil'

type BindCursorArgs = {
    scene: ROCursor<BattleScene>
    container: PixiContainer
}

export function bindEnergy({ scene, container }: BindCursorArgs) {
    const u = () => update({ scene, container })

    u()
    scene.select('energy').on('update', u)
    scene.select('isPlayerTurn').on('update', u)
    scene.select('state').on('update', u)
}

function update({ scene, container }: BindCursorArgs) {
    clearContainer(container)

    if (!scene.get('isPlayerTurn')) return
    if (scene.get('state') !== 'in battle') return

    container.addChild(Energy(scene.select('energy').get()))
}

function Energy(value: number): PixiContainer {
    const energyWidth = 180

    return Container({
        name: 'Energy',
        x: BASE_WIDTH * 0.06,
        y: BASE_HEIGHT * 0.75,
        children: [
            Sprite({
                src: getEnergySrc(),
                anchor: [0.5, 0.5],
                width: (energyWidth * BASE_WIDTH) / 1920,
                height: (energyWidth * BASE_WIDTH) / 1920,
            }),
            Text({
                text: `${value}`,
                style: {
                    fill: ['#f3ff30', '#DEBD00', '#D88F00'],
                    stroke: 'black',
                    strokeThickness: 5,
                    fontSize: 100,
                    fontFamily: 'VT323',
                },
                width: ((energyWidth / 2) * BASE_WIDTH) / 1920,
                height: ((energyWidth / 2) * BASE_WIDTH) / 1920,
                anchor: [0.5, 0.5],
            }),
        ],
    })
}

export const getEnergySrc = () => getTexture('energy')
