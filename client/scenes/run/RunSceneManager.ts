import { getBattleScene } from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import { Container, If } from '@/elementsUtil'
import { onUpdate, toDatum } from '@/util'
import { compose, datum } from 'datums'
import type { CardUid } from 'shared'
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
                    return !isInRestSite && !isInMap && !isInEventScene
                },
                toDatum(scene.select('isInRestSite'), is => is),
                toDatum(scene.select('isInMap'), is => is),
                toDatum(scene.select('isInEventScene'), is => is)
            ),
            () => BattleScene(scene, hoveredCardUid)
        ),
        If(
            toDatum(scene.select('isInEventScene'), is => is),
            () => EventScene()
        ),
        If(
            toDatum(scene.select('isInMap'), is => is),
            () => HexMapOverlay()
        ),
        If(
            toDatum(scene.select('isInRestSite'), is => is),
            () => RestSiteOverlay()
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
