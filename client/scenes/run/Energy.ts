import {
    getTexture,
    BASE_HEIGHT,
    BASE_WIDTH,
    Sprite,
    Text,
    Container,
    If,
    For,
    RoundedRectangleGradientSprite,
    fontMap,
} from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { onUpdate, toDatum } from '@/util'

export function Energy({ scene }: { scene: ROBattleScene }): PixiContainer {
    const showEnergy = toDatum(scene, scene => {
        return scene.state === 'in battle'
    })
    return If(showEnergy, () => EnergyEl(scene), undefined, {
        displayArgs: {
            onDestroy: [showEnergy.destroy],
        },
    })
}

function EnergyEl(scene: ROBattleScene): PixiContainer {
    const energyWidth = 180
    const energy = scene.select('energy')
    const roundEnergy = scene.select('roundEnergy')

    const text = Text({
        //TODO: dynamic energy based on round
        text: '',
        style: {
            // fill: ['#f3ff30', '#DEBD00', '#D88F00'],
            fill: '#eee',
            stroke: 'black',
            strokeThickness: 10,
            fontSize: 76,
            fontFamily: fontMap['bigFont'],
            letterSpacing: -6,
        },
        anchor: [0.5, 0],
    })

    const roundsDatum = toDatum(scene.select('turnCount'), turnCount =>
        new Array(6).fill(null).map((_, i) => {
            const isFull = turnCount > i + 1

            return {
                key: `${i}-${isFull ? 'filled' : 'empty'}`,
                isFull,
                index: i,
            }
        })
    )

    return Container(
        {
            name: 'Energy',
            x: BASE_WIDTH * 0.06,
            y: BASE_HEIGHT * 0.78,
            onDestroy: [
                onUpdate(
                    energy,
                    v => (text.text = `${v} / ${roundEnergy.get()}`),
                    true
                ),
            ],
        },
        Sprite({
            src: getEnergySrc(),
            anchor: [0.5, 0.5],
            width: (energyWidth * BASE_WIDTH) / 1920,
            height: (energyWidth * BASE_WIDTH) / 1920,
        }),
        text,
        For(roundsDatum, ({ isFull, index }) =>
            Container(
                {
                    x: index < 3 ? -80 : 80,
                    y: (index % 3) * -32 + 50,
                },
                Circle(0, 30),
                Circle(isFull ? 0xee41ea : 0x333333, 25)
            )
        )
    )
}

function Circle(color: number, radius: number) {
    return RoundedRectangleGradientSprite({
        radius,
        gradientArgs: {
            x0: 0,
            y0: 0,
            x1: 0,
            y1: radius,
            colorStops: [
                {
                    color,
                    offset: 0,
                },
            ],
        },
        spriteArgs: {
            width: radius,
            height: radius,
            x: 0,
            y: 0,
            anchor: 0.5,
        },
    })
}

export const getEnergySrc = () => getTexture('remainingEnergy')
