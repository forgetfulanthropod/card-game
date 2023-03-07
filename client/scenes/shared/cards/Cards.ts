import type { ROCursor } from 'sbaobab'
import type { BattleScene, CharacterUid } from 'shared'
import type { Datum } from 'datums'
import { DiscardPile } from './DiscardPile'
import { DrawPile } from './DrawPile'
import { Hand } from './Hand'
import { Container, If } from '@/elementsUtil'
import { toDatum } from '@/util'

type CardsArgs = {
    scene: ROCursor<BattleScene>
    hoveredCardUid: Datum<CharacterUid | null>
    toDiscardUids: Datum<CharacterUid[]>
}

export function Cards(args: CardsArgs) {
    const handDatum = toDatum(
        args.scene.select('cards').select('hand'),
        hand => hand
    )

    return Container(
        {},
        DrawPile(),
        DiscardPile(),
        If(handDatum, handPile =>
            Hand(handPile, args.hoveredCardUid, args.toDiscardUids)
        )
    )
}
