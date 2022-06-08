import type { ROCursor } from 'sbaobab'

import {
    getTexture,
    BASE_HEIGHT,
    BASE_WIDTH,
    Sprite,
    Text,
    Container,
    If,
} from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { onUpdate, toDatum } from '@/util'

export function Energy({ scene }: { scene: ROBattleScene }): PixiContainer {
    const showEnergy = toDatum(scene, scene => {
        return scene.isPlayerTurn && scene.state === 'in battle'
    })
    return If(showEnergy, () => EnergyEl(scene.select('energy')), undefined, {
        onDestroy: [showEnergy.destroy],
    })
}

function EnergyEl(value: ROCursor<number>): PixiContainer {
    const energyWidth = 180

    const text = Text({
        //TODO: dynamic energy based on round
        text: '',
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
    })
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
            text,
        ],
        onDestroy: [onUpdate(value, v => (text.text = `${v} / 3`), true)],
    })
}

export const getEnergySrc = () => getTexture('remainingEnergy')
