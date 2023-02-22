import { getBattleScene } from '@/data'
import {
    Adjust,
    AssetKey,
    BASE_WIDTH,
    Container,
    For,
    getTexture,
    Sprite,
} from '@/elementsUtil'
import { ContainerChild, DisplayObjectArgs } from '@/elementsUtil/mypixi/_types'
import { toDatum } from '@/util'
import { ExplanationIf, TEXT_WIDTH } from '@sharedElements'
import { datum } from 'datums'
import { upperFirst } from 'lodash'
import { ROCursor } from 'sbaobab'
import { BattleScene, Souvenir, SouvenirId } from 'shared'

export function SouvenirsEls(): ContainerChild {
    const scene = getBattleScene()
    return For(
        toDatum(scene.select('souvenirs'), souvenirs =>
            souvenirs.map((s, index) => ({ ...s, key: s.id, index }))
        ),
        souvenir => {
            const souvenirWidth = 80

            return Adjust(SouvenirEl({ souvenir, width: souvenirWidth }), {
                x: BASE_WIDTH - 140 - souvenir.index * souvenirWidth,
                y: 60,
            })
        }
    )
}

export function SouvenirEl({
    souvenir,
    width = 80,
    explanationYOffset = 10,
    displayArgs,
    explanationDisplayArgs,
}: {
    souvenir: Souvenir
    width?: number
    explanationYOffset?: number
    displayArgs?: DisplayObjectArgs
    explanationDisplayArgs?: DisplayObjectArgs
}) {
    const isHovered = datum(false)

    return Container(
        {},
        Sprite({
            src: `souvenir${upperFirst(souvenir.id)}` as AssetKey,
            scale:
                width /
                getTexture(`souvenir${upperFirst(souvenir.id)}` as AssetKey)
                    .width,
            anchor: [1, 0.5],
            events: {
                pointerover() {
                    isHovered.set(true)
                },
                pointerout() {
                    isHovered.set(false)
                },
            },
            ...(displayArgs || {}),
        }),
        ExplanationIf({
            isShown: isHovered,
            texts: [souvenir.name, souvenir.description],
            isHtml: true,
            xOffset: -TEXT_WIDTH * 1.1 - width,
            yOffset: explanationYOffset,
            displayArgs: explanationDisplayArgs,
        })
    )
}
