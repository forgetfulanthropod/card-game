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
import { hoveredCharacterUid, toDatum } from '@/util'
import { ExplanationIf, TEXT_WIDTH } from '@sharedElements'
import { datum } from 'datums'
import { omit, upperFirst } from 'lodash'
import { Souvenir } from 'shared'

export function SouvenirsEls(): ContainerChild {
    const scene = getBattleScene()
    return For(
        toDatum(scene.select('souvenirs'), souvenirs =>
            souvenirs.map((s, index) => ({
                ...s,
                key: `${s.id}-${index}`,
                index,
            }))
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
    const events = {
        pointerover() {
            isHovered.set(true)
            if (souvenir.characterUid)
                hoveredCharacterUid.set(souvenir.characterUid)
        },
        pointerout() {
            isHovered.set(false)
            if (souvenir.characterUid) hoveredCharacterUid.set(null)
        },
        ...(displayArgs?.events ?? {}),
    }

    return Container(
        {
            name: `souvenir${upperFirst(souvenir.id)}`,
        },
        Sprite({
            src: `souvenir${upperFirst(souvenir.id)}` as AssetKey,
            scale:
                width /
                getTexture(`souvenir${upperFirst(souvenir.id)}` as AssetKey)
                    .width,
            anchor: [1, 0.5],
            events,
            ...(displayArgs ? omit(displayArgs, 'events') : {}),
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
