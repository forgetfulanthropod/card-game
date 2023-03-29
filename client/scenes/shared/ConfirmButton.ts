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
import { GradientButton } from './GradientButton'

export function ConfirmButton(onClick: () => void): PixiContainer {
    return GradientButton({
        onClick,
        text: 'confirm',
        x: BASE_WIDTH * 0.9,
        y: BASE_HEIGHT * 0.78,
        fontSize: 35,
        xPadding: 30,
        yPadding: 11,
        outlineColor: 0x002717
    })
}
