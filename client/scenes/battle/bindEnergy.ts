import type { ROCursor } from 'sbaobab'
import type { BattleScene } from 'shared'

import {
    getTexture,
    BASE_HEIGHT,
    BASE_WIDTH,
    Sprite,
    Text,
    Container,
    clearContainer,
} from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { onUpdate } from '@/util'

type BindCursorArgs = {
    scene: ROCursor<BattleScene>
    container: PixiContainer
}

export function bindEnergy({ scene, container }: BindCursorArgs): Unbind {
    const u = () => update({ scene, container })

    u()
    const unsubs = [
        onUpdate(scene.select('energy'), u),
        onUpdate(scene.select('isPlayerTurn'), u),
        onUpdate(scene.select('state'), u),
    ]
    return () => unsubs.forEach(unsub => unsub())
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
                //TODO: dynamic energy based on round
                text: `${value} / 3`,
                style: {
                    // fill: ['#f3ff30', '#DEBD00', '#D88F00'],
                    fill: '#eee',
                    stroke: 'black',
                    strokeThickness: 10,
                    fontSize: 76,
                    fontFamily: 'bigFont',
                    letterSpacing: -6,
                },
                anchor: [0.5, 0],
            }),
        ],
    })
}

export const getEnergySrc = () => getTexture('energy')
