import { getBattleScene } from '@/data'
import { Container, If } from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { toDatum } from '@/util'

export function CardAdder(): PixiContainer {
    // const w = 400
    const stateC = getBattleScene().select('state')
    const notInBattle = toDatum(
        stateC,
        winState => winState === 'choosing cards'
    )
    return If(
        notInBattle,
        // () =>
        //     PlainButton({
        //         text: 'start next room',
        //         onClick: () => callApi('NextRoom', {}),
        //         fontSize: 40,
        //         width: w,
        //         x: BASE_WIDTH / 2 - w / 2,
        //         y: BASE_HEIGHT / 2,
        //     }),
        // () =>
        () => NewCardOptions(),
        undefined,
        { onDestroy: [notInBattle.destroy], name: CardAdder.name }
    )
}

function NewCardOptions(): PixiContainer {
    return Container({
        children: [
            // Backdrop(),
            // Options(),
            // ConfirmButton()
        ],
    })
}
