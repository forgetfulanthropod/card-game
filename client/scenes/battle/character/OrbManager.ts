import { getOrbTexture } from '@/assets'
import { nextTick, onUpdate, toDatum } from '@/util'
import {
    Container,
    For,
    getStage,
    glowFilter,
    If,
    portalize,
    SCALE_UNIVERSAL,
    Sprite,
    Text,
} from '@/elementsUtil'
import { PixiContainer } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { CharacterCursor } from './Character'
import { datum } from 'datums'
import {
    ExplanationBox,
    KeyTerm,
    TermExplanationBox,
    TermExplanationIf,
} from '@/scenes/shared'
import { omit, upperFirst } from 'lodash'

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
