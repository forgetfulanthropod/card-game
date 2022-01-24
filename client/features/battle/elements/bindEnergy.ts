import type { BattleScene } from '@shared'
import type { SCursor } from 'baobab'
import { Loader } from 'pixi.js'

import type { PixiContainer, PixiTexture } from '@/elementsUtil'
import { BASE_HEIGHT } from '@/elementsUtil'
import { BASE_WIDTH } from '@/elementsUtil'
import { Sprite, Text } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { clearContainer } from '@/elementsUtil'

type BindCursorArgs = {
    scene: SCursor<BattleScene>
    container: PixiContainer
}

export function bindEnergy({ scene, container }: BindCursorArgs) {
    update({ scene, container })
    scene.select('energy').on('update', () => {
        update({ scene, container })
    })
}

function update({ scene, container }: BindCursorArgs) {
    clearContainer(container)

    container.addChild(Energy(scene.select('energy').get()))
}

function Energy(value: number): PixiContainer {
    return Container({
        name: 'Energy',
        x: BASE_WIDTH / 8,
        y: BASE_HEIGHT * 0.7,
        children: [
            Sprite({ src: getEnergySrc(), anchor: [0.5, 0.5] }),
            Text({
                text: `${value}`,
                style: {
                    fill: 'white',
                    fontSize: 100,
                    fontFamily: 'VT323',
                },
                width: getEnergySrc().width * 0.5,
                height: getEnergySrc().height * 0.5,
                anchor: [0.5, 0.5],
            }),
        ],
    })
}

export const getEnergySrc = () =>
    Loader.shared.resources?.energy?.texture as PixiTexture
