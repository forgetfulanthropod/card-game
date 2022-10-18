import { Datum } from 'datums'
import { getStage, If, PixiContainer, portalize } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { nextTick } from '@/util'
import { ExplanationBox, KeyTerm, TermExplanationBox } from '@/scenes/shared'

export function ExplanationIf({
    isShown,
    texts,
    xOffset = 0,
    yOffset = 0,
}: {
    isShown: Datum<boolean>
    texts: string[]
    xOffset?: number
    yOffset?: number
}): PixiContainer {
    return If(isShown, () => {
        const root = Container({})

        nextTick().then(() =>
            portalize({
                from: root,
                to: () => getStage(),
                content: ExplanationBox({
                    texts,
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
