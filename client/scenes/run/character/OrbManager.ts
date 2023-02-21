import { getOrbTexture } from '@/assets'
import { callApi } from '@/callApi'
import {
    Container,
    For,
    glowFilter,
    PixiContainer,
    Sprite,
    Text,
} from '@/elementsUtil'
import { KeyTerm, TermExplanationIf } from '@/scenes/shared'
import { toDatum } from '@/util'
import { datum } from 'datums'
import { omit, upperFirst } from 'lodash'
import { CharacterCursor } from './Character'

export function OrbManager(
    characterCursor: CharacterCursor,
    offset: number
): PixiContainer {
    const orbWidth = 55

    const orbsCursor = characterCursor.select('orbs')

    return For(
        toDatum(orbsCursor, orbs => {
            return orbs.map((orb, i) => ({
                ...orb,
                i,
                key: Math.random().toString(),
            }))
        }),
        orb => {
            const isHovered = datum(false)
            const orbEl = Container(
                {
                    y: -offset,
                    x: orb.i * orbWidth * 1.5,
                    events: {
                        pointerdown() {
                            isHovered.set(true)
                        },
                        pointerover() {
                            isHovered.set(true)
                        },
                        pointerup() {
                            // console.log({ orb })
                            void callApi('activateOrb', {
                                characterUid: characterCursor.get('uid'),
                                orb: omit(orb, 'key', 'i'),
                            })
                            isHovered.set(false)
                        },
                        pointerout() {
                            isHovered.set(false)
                        },
                    },
                    onDestroy: [
                        isHovered.onChange(
                            is => (orbEl.filters = is ? [glowFilter] : [])
                        ),
                    ],
                },
                Sprite({
                    src: getOrbTexture(orb.type),
                    width: orbWidth,
                    height: orbWidth,
                }),
                Text({
                    text: `${orb.remainingCount}`,
                    style: {
                        fontFamily: 'bigFont',
                        // fontSize: 30,
                        fill: ['#fff', '#eee'],

                        // letterSpacing: -5,
                        stroke: '#333',
                        strokeThickness: 5,
                    },
                }),
                TermExplanationIf({
                    isShown: isHovered,
                    term: `orbsOf${upperFirst(orb.type)}` as KeyTerm,
                    xOffset: 100,
                })
            )

            return orbEl
        }
    )
}
