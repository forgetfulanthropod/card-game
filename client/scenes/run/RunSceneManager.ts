import { getBattleScene } from '@/data'
import { Container, If, PixiContainer } from '@/elementsUtil'
import { onUpdate, toDatum } from '@/util'
import { compose, datum } from 'datums'
import type { CardUid } from 'shared'
import { BattleScene, immediatelyTakeRequiredAction } from './BattleScene'
import { EventSceneEl } from './EventScene'
import { HexMapOverlay } from './HexMapOverlay'
import { RestSiteOverlay } from './RestSiteOverlayPicnic'

export function RunSceneManager(): PixiContainer {
    const hoveredCardUid = datum<CardUid | null>(null)

    const scene = getBattleScene()

    const root = Container(
        {
            name: 'RunSceneManager',
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
                ([{ isInRestSite, isInMap, isInEventScene }]) => {
                    return isInRestSite || isInMap || isInEventScene
                        ? { isInRestSite, isInMap, isInEventScene }
                        : false
                },
                toDatum(scene.select('isInMap'), isInMap => ({
                    isInMap,
                    isInRestSite:
                        scene.get('currentRoom', 'category') === 'restSite',
                    isInEventScene:
                        scene.get('currentRoom', 'category') === 'events',
                }))
            ),
            ({ isInRestSite, isInMap, isInEventScene }) => {
                if (isInMap) return HexMapOverlay()
                if (isInRestSite) return RestSiteOverlay()
                if (isInEventScene) return EventSceneEl()

                throw new Error('unclear scene choice')
            },
            () => {
                return BattleScene(scene, hoveredCardUid)
            },
            { transition: true }
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
