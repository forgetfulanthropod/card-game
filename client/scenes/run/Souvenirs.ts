import { callApi } from '@/callApi'
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
        pointerenter() {
            isHovered.set(true)
            if (souvenir.characterUid)
                hoveredCharacterUid.set(souvenir.characterUid)
        },
        pointerleave() {
            isHovered.set(false)
            if (souvenir.characterUid) hoveredCharacterUid.set(null)
        },
        pointerup() {
            if (souvenir.on.activate)
                callApi('activateSouvenir', { souvenirId: souvenir.id })
        },
        ...(displayArgs?.events ?? {}),
    }
    // TODO better/auto fallback
    let textureKey = `souvenir${upperFirst(souvenir.id)}` as AssetKey
    let texture
    try {
        texture = getTexture(textureKey)
    } catch (e) {
        textureKey = 'souvenirPlaceholder' as AssetKey
        texture = getTexture(textureKey)
    }
    return Container(
        {
            name: textureKey,
        },
        Sprite({
            src: textureKey,
            scale: width / texture.width,
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
