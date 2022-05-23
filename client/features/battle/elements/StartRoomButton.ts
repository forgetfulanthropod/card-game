import { callApi } from '@/actions'
import { PlainButton } from '@/elements'
import type { PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'

export function StartRoomButton(): PixiContainer {
    const w = 400
    return PlainButton({
        text: 'start next round',
        onClick: () => callApi('NextRoom', {}),
        fontSize: 40,
        width: w,
        x: BASE_WIDTH / 2 - w / 2,
        y: BASE_HEIGHT / 2,
    })
}
