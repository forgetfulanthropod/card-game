import { getBattleScene } from '@/data'
import {
    AssetKey,
    BASE_HEIGHT,
    BASE_WIDTH,
    For,
    getTexture,
    PixiContainer,
    Sprite,
} from '@/elementsUtil'
import { Container, If } from '@/elementsUtil'
import { onUpdate, toDatum } from '@/util'
import { compose, datum } from 'datums'
import { upperFirst } from 'lodash'
import type { CardUid } from 'shared'
import { ExplanationIf, TEXT_WIDTH } from '../shared'
import { BattleScene, immediatelyTakeRequiredAction } from './BattleScene'
import { EventScene } from './EventScene'
import { HexMapOverlay } from './HexMapOverlay'
import { RestSiteOverlay } from './RestSiteOverlayPicnic'

export function RunSceneManager(): PixiContainer {
    const hoveredCardUid = datum<CardUid | null>(null)

    const scene = getBattleScene()

    const root = Container(
        {
            name: 'BattleScene',
            onDestroy: [
                onUpdate(
                    scene.select('requireAction'),
                    immediatelyTakeRequiredAction,
                    true
                ),
            ],
        },
        If(
            compose(
                ([isInRestSite, isInMap, isInEventScene]) => {
                    return isInRestSite || isInMap || isInEventScene
                        ? { isInRestSite, isInMap, isInEventScene }
                        : false
                },
                toDatum(scene.select('isInRestSite'), is => is),
                toDatum(scene.select('isInMap'), is => is),
                toDatum(scene.select('isInEventScene'), is => is)
            ),
            ({ isInRestSite, isInMap, isInEventScene }) => {
                if (isInEventScene) return EventScene()
                if (isInMap) return HexMapOverlay()
                if (isInRestSite) return RestSiteOverlay()

                throw new Error('unclear scene choice')
            },
            () => BattleScene(scene, hoveredCardUid),
            { transition: true }
        ),
        For(
            toDatum(scene.select('souvenirs'), souvenirs =>
                souvenirs.map((s, index) => ({ ...s, key: s.id, index }))
            ),
            souvenir => {
                const isHovered = datum(false)
                const souvenirWidth = 120
                return Container(
                    {
                        x:
                            BASE_WIDTH -
                            100 -
                            souvenir.index * souvenirWidth * 1.2,
                        y: 40,
                    },
                    Sprite({
                        src: `souvenir${upperFirst(souvenir.id)}` as AssetKey,
                        scale:
                            souvenirWidth /
                            getTexture(
                                `souvenir${upperFirst(souvenir.id)}` as AssetKey
                            ).width,
                        anchor: [1, 0],
                        events: {
                            pointerover() {
                                isHovered.set(true)
                            },
                            pointerout() {
                                isHovered.set(false)
                            },
                        },
                    }),
                    ExplanationIf({
                        isShown: isHovered,
                        texts: [souvenir.name, souvenir.description],
                        isHtml: true,
                        xOffset: -TEXT_WIDTH * 1.1 - souvenirWidth,
                    })
                )
            }
        )
    )

    let battleRoomInfo: null | PixiContainer
    // root.on(
    //     'destroyed',
    //     onUpdate(
    //         scene.select('numRoomsPassed'),
    //         num => {
    //             if (battleRoomInfo) root.removeChild(battleRoomInfo)
    //             battleRoomInfo = BattleRoomInfo({
    //                 info: [
    //                     num == null || num === -1
    //                         ? ''
    //                         : `${num} room${num === 1 ? '' : 's'} cleared`,
    //                 ],
    //             })
    //             root.addChild(battleRoomInfo)
    //         },
    //         true
    //     )
    // )

    return root
}
