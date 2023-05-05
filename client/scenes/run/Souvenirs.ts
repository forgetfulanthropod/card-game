import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import {
    Adjust,
    BASE_WIDTH,
    Container,
    For,
    getTexture,
    glowFilter,
    If,
    PixiTexture,
    SouvenirAssetKey,
    souvenirAssets,
    Sprite,
} from '@/elementsUtil'
import { ContainerChild, DisplayObjectArgs } from '@/elementsUtil/mypixi/_types'
import { hoveredCharacterUid, toDatum } from '@/util'
import { ExplanationIf, TEXT_WIDTH } from '@sharedElements'
import { compose, Datum, datum } from 'datums'
import { omit, upperFirst } from 'lodash'
import { Assets } from 'pixi.js'
import { Souvenir } from 'shared'

export function SouvenirsEls(
    newSouvenirsDatum = datum<Souvenir[]>([])
): ContainerChild {
    const scene = getBattleScene()
    return For(
        compose(
            ([newSouvenirs, souvenirs]) => {
                return [...newSouvenirs, ...souvenirs]
                    .reverse()
                    .map((s, index) => ({
                        ...s,
                        key: `${s.id}-${index}`,
                        index,
                    }))
            },
            newSouvenirsDatum,
            toDatum(scene.select('souvenirs'), souvenirs => souvenirs)
        ),
        souvenir => {
            const souvenirWidth = 90

            return Adjust(SouvenirEl({ souvenir, width: souvenirWidth }), {
                x: BASE_WIDTH - 140 - souvenir.index * souvenirWidth,
                y: 60,
                filters: ~newSouvenirsDatum.val.findIndex(
                    s => s.id === souvenir.id
                )
                    ? [glowFilter]
                    : [],
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
    let textureKey = `souvenir${upperFirst(souvenir.id)}` as SouvenirAssetKey
    const textureDatum = datum<null | PixiTexture>(null)
    try {
        textureDatum.set(getTexture(textureKey))

        if (width > (textureDatum.val?.width ?? 0)) {
            textureDatum.set(null)
            const path = souvenirAssets[textureKey]
            Assets.load(
                path.replace('souvenirs/', 'assets/souvenirs/_full/')
            ).then(t => textureDatum.set(t))
        }
    } catch (e) {
        textureKey = 'souvenirPlaceholder' as SouvenirAssetKey
        textureDatum.set(getTexture(textureKey))
    }

    return Container(
        {
            name: textureKey,
        },
        If(
            compose(([texture]) => texture, textureDatum),
            src =>
                Sprite({
                    src,
                    scale: width / src.width,
                    anchor: [1, 0.5],
                    events,
                    ...(displayArgs ? omit(displayArgs, 'events') : {}),
                })
        ),
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
