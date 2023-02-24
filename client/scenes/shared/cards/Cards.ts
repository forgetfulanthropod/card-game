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
    const cardsDatum = toDatum(args.scene.select('cards'), cards => {
        if (args.scene.get('state') !== 'in battle') return false
        return cards
    })
    return If(cardsDatum, cards =>
        Container(
            {},
            DrawPile(cards['draw']),
            DiscardPile(cards['discard']),
            Hand(cards['hand'], args.hoveredCardUid, args.toDiscardUids)
        )
    )
}
