import { Datum } from 'datums'
import { CardUid } from 'shared'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    If,
    Sprite,
} from '@/elementsUtil'
import { PixiContainer } from '@/elementsUtil'
import { callApi } from '@/callApi'

export function ConfirmButton(onClick: () => void): PixiContainer {
    const texture = getTexture('confirmButton')

    return Container(
        {
            x: BASE_WIDTH * 0.9,
            y: BASE_HEIGHT * 0.78,
            onClick,
        },
        Sprite({
            src: texture,
            anchor: [0.5, 0.5],
            width: BASE_WIDTH * 0.15,
            height: (BASE_WIDTH * 0.15 * texture.height) / texture.width,
        })
        // Text({
        //     text: 'Confirm',
        //     anchor: [0.5, 0.5],
        //     style: {
        //         fill: 0xffffff,
        //         fontSize: 44,
        //         fontFamily: 'bigFont',
        //     },
        // }),
    )
}
