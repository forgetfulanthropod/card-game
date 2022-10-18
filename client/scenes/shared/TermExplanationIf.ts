import { Datum } from 'datums'
import { getStage, If, PixiContainer, portalize } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { nextTick } from '@/util'
import { KeyTerm, TermExplanationBox } from '@/scenes/shared'

export function TermExplanationIf({
    isShown,
    term,
    xOffset = 0,
    yOffset = 0,
}: {
    isShown: Datum<boolean>
    term: KeyTerm
    xOffset?: number
    yOffset?: number
}): PixiContainer {
    return If(isShown, () => {
        const root = Container({})

        nextTick().then(() =>
            portalize({
                from: root,
                to: () => getStage(),
                content: TermExplanationBox({
                    term,
                    displayObjectArgs: {
                        x: root.getGlobalPosition().x + xOffset,
                        y: root.getGlobalPosition().y + yOffset,
                    },
                }),
            })
        )

        return root
    })
}
