import { DisplayObject, Texture } from 'pixi.js'
import { startCase } from 'lodash'
import type { InfoBoxDisplayArgs } from '.'
import { InfoBox } from '.'
import {
    DisplayObjectArgs,
    getStage,
    If,
    PixiContainer,
    portalize,
} from '@/elementsUtil'
import {
    getRenderer,
    Sprite,
    Text,
    BASE_WIDTH,
    Container,
} from '@/elementsUtil'
import { keys } from 'shared/code'
import { Datum } from 'datums'
import { nextFrame, nextTick, targetUidsWaitingForImpact } from '@/util'

export const keyTermsMap = {
    momentary: 'removed until end of room',
    brittle: 'breaks after (X) uses',
    dwindle: 'costs +1 energy each use in room',

    orbsOfProtection: 'blocks for 50% of Magic',
    orbsOfLightning: 'deal 35% of Magic to all enemies',
    orbsOfFrost: '+1 Strongblock to party\n+1 Tired to enemies',
    orbsOfHolyLight: 'heals for 12% of Magic\nblocks for 50% of Defense',

    // grudge: 'intentGrudge',
    // infectiousBite: 'unblocked damage becomes Poison',
    // mimicAttack: 'deal 999 or copies the last hit taken this turn',

    berserk:
        '(aggressive stance only) deals 50% more damage, takes 100% more damage',
    bleed: '(unblockable) receives damage equal to 5% of max Health at start of turn',
    brave: 'deals 15% more damage',
    courageous: 'deals 25% more damage',
    debilitated: 'deals 50% less damage',
    entranced: 'increases Magic by (N)',
    fatigued: 'deals 25% less damage',
    fortified: 'receives 50% more block',
    guarded: 'receives 25% less damage',
    poisoned: '(unblockable) receives (N) damage',
    piercing: 'ignores block',
    reflect: 'reflects up to (N) to attacker',
    strongblock: 'receives 50% more block',
    stunned: 'cannot take an action this turn',
    targeted: 'receives 5 extra damage',
    tired: 'deals 12% less damage',
    unguarded: 'receives 25% more damage',
    unready: 'receives 12% more damage',
    vulnerable: 'receives 50% more damage',
}

export type KeyTerm = keyof typeof keyTermsMap

export function getTermIndex(term: string, explanation: string): number {
    const lowerCaseTerm = startCase(term).toLowerCase()
    var re = new RegExp(`${lowerCaseTerm}`, 'g')

    return explanation.toLowerCase().search(re)
}

export function TermExplanationsIf({
    areShown,
    terms,
    xOffset = 0,
    yOffset = 0,
}: {
    areShown: Datum<boolean>
    terms: KeyTerm[]
    xOffset?: number
    yOffset?: number
}) {
    return If(areShown, () =>
        portalizeExplanations(
            Container({}),
            TermExplanations({
                terms,
                displayObjectArgs: {
                    x: xOffset,
                    y: yOffset,
                },
            })
        )
    )
}

export function TermExplanations({
    terms,
    displayObjectArgs,
}: {
    terms: KeyTerm[]
    displayObjectArgs?: DisplayObjectArgs
}): PixiContainer[] {
    const termBoxes = terms.map(term =>
        TermExplanation({ term, displayObjectArgs })
    )

    const subTermBoxes = keys(keyTermsMap)
        .filter(
            term =>
                ~terms.findIndex(
                    mainTerm => ~getTermIndex(term, keyTermsMap[mainTerm])
                )
        )
        .map(term => TermExplanation({ term, displayObjectArgs }))

    const boxes = [...termBoxes, ...subTermBoxes]

    boxes.forEach((box, i) => {
        if (i > 0) {
            const lastBox = boxes[i - 1]
            box.y = lastBox.y + lastBox.height + 5
        }

        return box
    })

    return boxes
}

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
        return portalizeExplanations(Container({}), [
            TermExplanation({
                term,
                displayObjectArgs: { x: xOffset, y: yOffset },
            }),
        ])
    })
}

function portalizeExplanations(
    root: PixiContainer<DisplayObject>,
    content: PixiContainer[]
) {
    nextFrame().then(() => {
        nextFrame().then(() => {
            if (root == null || root.parent == null) return

            if (targetUidsWaitingForImpact.val.length) return

            portalize({
                from: root,
                content: Container(
                    {
                        x: root.getGlobalPosition().x,
                        y: root.getGlobalPosition().y,
                    },
                    ...content
                ),
                // nextFrame: true,
            })
        })
    })

    return root
}

export function TermExplanation({
    term,
    displayObjectArgs,
}: {
    term: KeyTerm
    displayObjectArgs?: DisplayObjectArgs
}): PixiContainer {
    let topText = startCase(term).replace('Orbs', 'Orb')

    if (topText.includes('Orb')) {
        topText = topText + ' (clickable!)'
    }

    return Explanation({
        // text: `<div style="font-family: sans-serif">
        //     <b>${startCase(term)}</b>
        //     <br/>
        //     ${keyTermsMap[term]}
        // </div>`,
        texts: [topText, `${keyTermsMap[term]}`],
        displayObjectArgs: {
            borderThickness: 2,
            padding: 10,
            ...displayObjectArgs,
        },
    })
}

export function ExplanationIf({
    isShown,
    texts,
    xOffset = 0,
    yOffset = 0,
    isHtml = false,
}: {
    isShown: Datum<boolean>
    texts: string[]
    xOffset?: number
    yOffset?: number
    isHtml?: boolean
}): PixiContainer {
    return If(isShown, () => {
        return portalizeExplanations(Container({}), [
            Explanation({
                texts,
                isHtml,
                displayObjectArgs: {
                    borderThickness: 2,
                    padding: 10,
                    x: xOffset,
                    y: yOffset,
                },
            }),
        ])
    })
}

export function Explanation({
    texts,
    color,
    displayObjectArgs,
    isHtml = false,
}: {
    texts: string[]
    color?: number
    displayObjectArgs?: InfoBoxDisplayArgs
    isHtml?: boolean
}): PixiContainer {
    const textEls = texts.map((text, index) => {
        return Text({
            text,
            isHtml,
            style: {
                fill: 'white',
                wordWrapWidth: BASE_WIDTH * 0.18,
                wordWrap: true,
                fontWeight: texts.length > 1 && index === 0 ? 'bold' : '400',
                fontSize: displayObjectArgs?.fontSize ?? 20,
            },
        })
    })

    const margin = 5

    textEls.forEach((el, index) => {
        if (index > 0) {
            const lastEl = textEls[index - 1]
            el.y = lastEl.y + lastEl.height + margin
        }
    })

    // console.log({ textEls, texts })

    return InfoBox(
        Container(
            {},
            Sprite({
                src: Texture.EMPTY,
                width: textEls.reduce(
                    (maxW, el) => Math.max(el.width, maxW),
                    0
                ),
                height: textEls.reduce((totalH, el) => totalH + el.height, 0),
            }),
            ...textEls
        ),
        {
            padding: 25,
            ...(displayObjectArgs ?? {}),
            ...(color ? { colorStops: [{ color, offset: 0 }] } : {}),
        }
    )
}

function ElToSprite(el: DisplayObject) {
    return Sprite({ src: getRenderer().generateTexture(el) })
}
