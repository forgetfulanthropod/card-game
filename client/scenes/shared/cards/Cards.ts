import { Container } from '@/elementsUtil'
import type { Datum } from 'datums'
import type { ROCursor } from 'sbaobab'
import type { BattleScene, CharacterUid } from 'shared'
import { DiscardPile, DrawPile } from './DrawAndDiscardPiles'
import { Hand } from './Hand'

type CardsArgs = {
    scene: ROCursor<BattleScene>
    hoveredCardUid: Datum<CharacterUid | null>
    toDiscardUids: Datum<CharacterUid[]>
}

export function Cards(args: CardsArgs) {
    return Container(
        {},
        Hand(args.hoveredCardUid, args.toDiscardUids),
        DrawPile(),
        DiscardPile()
    )
}
