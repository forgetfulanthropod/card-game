import { getBattleScene } from '@/data'
import {
    AssetKey,
    BASE_WIDTH,
    Container,
    For,
    getTexture,
    Sprite,
} from '@/elementsUtil'
import { ContainerChild } from '@/elementsUtil/mypixi/_types'
import { toDatum } from '@/util'
import { ExplanationIf, TEXT_WIDTH } from '@sharedElements'
import { datum } from 'datums'
import { upperFirst } from 'lodash'
import { ROCursor } from 'sbaobab'
import { BattleScene } from 'shared'

export function Souvenirs(): ContainerChild {
    const scene = getBattleScene()
    return For(
        toDatum(scene.select('souvenirs'), souvenirs =>
            souvenirs.map((s, index) => ({ ...s, key: s.id, index }))
        ),
        souvenir => {
            const isHovered = datum(false)
            const souvenirWidth = 80
            return Container(
                {
                    x: BASE_WIDTH - 100 - souvenir.index * souvenirWidth,
                    y: 0,
                },
                Sprite({
                    src: `souvenir${upperFirst(souvenir.id)}` as AssetKey,
                    scale:
                        souvenirWidth /
                        getTexture(
                            `souvenir${upperFirst(souvenir.id)}` as AssetKey
                        ).width,
                    anchor: [1, 0],
                    events: {
                        pointerover() {
                            isHovered.set(true)
                        },
                        pointerout() {
                            isHovered.set(false)
                        },
                    },
                }),
                ExplanationIf({
                    isShown: isHovered,
                    texts: [souvenir.name, souvenir.description],
                    isHtml: true,
                    xOffset: -TEXT_WIDTH * 1.1 - souvenirWidth,
                })
            )
        }
    )
}
