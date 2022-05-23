import { callApi } from '@/actions'
import { getBattleScene } from '@/data'
import { PlainButton } from '@/elements'
import type { PixiContainer } from '@/elementsUtil'
import { If, BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { toDatum } from '@/util'

export function StartRoomButton(): PixiContainer {
    const w = 400
    const stateC = getBattleScene().select('state')
    const notInBattle = toDatum(stateC, x => x !== 'in battle')
    return If(
        notInBattle,
        () =>
            PlainButton({
                text: 'start next room',
                onClick: () => callApi('NextRoom', {}),
                fontSize: 40,
                width: w,
                x: BASE_WIDTH / 2 - w / 2,
                y: BASE_HEIGHT / 2,
            }),
        undefined,
        { onDestroy: [notInBattle.destroy] }
    )
}
