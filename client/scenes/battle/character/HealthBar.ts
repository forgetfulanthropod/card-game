import { Rectangle, Texture } from 'pixi.js'
import type { ROCursor } from 'sbaobab'
import type { CharacterMeta, CharacterUid, Effect } from 'shared'

import { getEffectIconSrc } from '@/scenes'
import { callApi } from '@/actions'
import { getBattleScene } from '@/data'
import type { PixiContainer, PixiTexture } from '@/elementsUtil'
import {
    For,
    If,
    onDestroyed,
    getTexture,
    SCALE_UNIVERSAL,
    Container,
    Sprite,
    Text,
} from '@/elementsUtil'
import { onUpdate, toDatum } from '@/util'

type Rect = [
    number, // x
    number, // y
    number, // width
    number // height
]

export const HEALTH_BAR_WIDTH = 300
// const rawWidth = 1841
// const rawHeight = 161
// const widthToHeight = rawHeight / rawWidth
// const displayHeight = HEALTH_BAR_WIDTH * widthToHeight

export function HealthBar(characterUid: CharacterUid): PixiContainer {
    const characterCursor = getCharacterCursor(characterUid)
    return Container({
        name: 'HealthBar',
        children: [
            HealthIndicator(characterCursor),
            StanceIndicator(characterCursor),
            EffectIndicators(characterCursor),
            BlockIndicator(characterCursor),
        ],
    })
}

function getCharacterCursor(characterUid: string) {
    return getBattleScene().select('allCharacters').select(characterUid)
}

function BlockIndicator(characterCursor: ROCursor<CharacterMeta>) {
    const data = toDatum(characterCursor.select('block'), b => b)
    return If(data, block =>
        Container({
            // y: -50 *  SCALE_UNIVERSAL,
            x: 200,
            children: [
                Sprite({
                    src: getTexture('blockIcon'),
                    width: 60 * SCALE_UNIVERSAL,
                    height: 60 * SCALE_UNIVERSAL,
                    anchor: [0.5, 0.5],
                }),
                Text({
                    text: `${block}`,
                    anchor: [0.5, 0.5],
                    style: {
                        // fontFamily: ['bigFont', 'monospace'],
                        fontFamily: ['monospace'],
                        fontSize: 22,
                        fill: '#eee',
                        stroke: '#666',
                        strokeThickness: 5,
                    },
                }),
            ],
        })
    )
}

function EffectIndicators(characterCursor: ROCursor<CharacterMeta>) {
    const effectsCursor = characterCursor.select('effects')
    const data = toDatum(effectsCursor, effects =>
        effects.map(e => ({ ...e, key: e.id + e.counter }))
    )
    return For(
        data,
        effect => SingleEffect(effect),
        idx => ({ y: 50 * SCALE_UNIVERSAL, x: idx * 50 * SCALE_UNIVERSAL })
    )
}

function SingleEffect(effect: Effect): PixiContainer {
    return Container({
        children: [
            Sprite({
                src: getEffectIconSrc(effect.id),
                width: 80 * SCALE_UNIVERSAL,
                height: 80 * SCALE_UNIVERSAL,
                anchor: [0.5, 0.4],
            }),
            Text({
                text: `${effect.counter}`,
                anchor: [0.6, 1],
                style: {
                    fontFamily: ['bigFont', 'monospace'],
                    fontSize: 30 * SCALE_UNIVERSAL,
                    fill: 'white',
                    stroke: 'black',
                    strokeThickness: 5,
                },
            }),
        ],
    })
}

function StanceIndicator(characterCursor: ROCursor<CharacterMeta>) {
    const data = toDatum(characterCursor, ({ isPc, stance, uid }) => {
        if (!isPc) return false
        return { stance, uid }
    })
    return If(data, ({ stance, uid }) => {
        const stanceSrc =
            stance === 'neutral'
                ? getTexture('stanceNeutral')
                : stance === 'aggressive'
                ? getTexture('stanceAggressive')
                : getTexture('stanceDefensive')
        return Sprite({
            src: stanceSrc,
            x: HEALTH_BAR_WIDTH * 0.7,
            y: 20,
            anchor: [1, 0],
            width: HEALTH_BAR_WIDTH / 4,
            height: (HEALTH_BAR_WIDTH / 4 / stanceSrc.width) * stanceSrc.height,
            onClick: () => callApi('ToggleStance', { characterUid: uid }),
        })
    })
}

function StanceBarIndicator(characterCursor: ROCursor<CharacterMeta>) {
    const data = toDatum(characterCursor, ({ isPc, stance, uid }) => {
        if (!isPc) return false
        return { stance, uid }
    })
    return If(data, ({ stance, uid }) => {
        if (stance === 'neutral') {
            return Container({ children: [] })
        }

        return Sprite({
            src:
                stance === 'aggressive'
                    ? 'healthBarAggressive'
                    : 'healthBarAvoidant',
            anchor: spriteAnchor,
        })
    })
}

const spriteAnchor: [number, number] = [0, 0.5]

function HealthIndicator(characterCursor: ROCursor<CharacterMeta>) {
    return Container({
        x: -HEALTH_BAR_WIDTH * 0.2,
        children: [
            Sprite({
                src: 'healthBarBacking',
                anchor: spriteAnchor,
            }),
            BaseHealth(characterCursor),
            Sprite({
                src: 'healthBarHighlight',
                anchor: spriteAnchor,
            }),
            Sprite({
                src: 'healthBarShadow',
                anchor: spriteAnchor,
            }),
            StanceBarIndicator(characterCursor),

            // todo: projected damage and DoT
            // ProjectedDamage(characterCursor),
            // ProjectedDoT(characterCursor),

            Text({
                text: characterCursor.select('health'),
                zIndex: 1,
                anchor: [0.5, 0.6],
                x: HEALTH_BAR_WIDTH / 2,
                style: {
                    fontFamily: 'bigFont',
                    fontSize: 20,
                    fill: 'white',
                    stroke: '#111',
                    strokeThickness: 4,
                    // letterSpacing: -3,
                },
            }),
        ],
    })
}

function BaseHealth(characterCursor: ROCursor<CharacterMeta>) {
    const originalTexture = getTexture('healthBarHealth')
    const texture = new Texture(originalTexture.baseTexture)
    const el = Sprite({
        src: texture,
        scale: HEALTH_BAR_WIDTH / texture.width,
        anchor: spriteAnchor,
        x: originalTexture.width * 0.1,
    })

    let lastHealth: number

    return onDestroyed(el, onUpdate(characterCursor, update, true))

    function update(cm: CharacterMeta) {
        const portion = cm.health / cm.constitution

        if (cm.health !== lastHealth) updateFrame(texture, 0, portion)

        lastHealth = characterCursor.get('health')
    }
}

function updateFrame(
    texture: PixiTexture,
    portionFrom: number,
    portionTo: number
) {
    const textureRef = getTexture('healthBarBacking')
    const startingWidth = textureRef.width
    const startingHeight = textureRef.height

    texture.frame = new Rectangle(
        startingWidth * (portionFrom + 0.1),
        0,
        startingWidth * (portionTo * 0.8),
        startingHeight
    )
    texture.updateUvs()
}
