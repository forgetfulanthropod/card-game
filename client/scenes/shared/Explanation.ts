import {
    BASE_WIDTH,
    Container,
    DisplayObjectArgs,
    getRenderer,
    If,
    PixiContainer,
    portalize,
    Sprite,
    Text,
} from '@/elementsUtil'
import { nextFrame, targetUidsWaitingForImpact } from '@/util'
import { Datum } from 'datums'
import { startCase, upperFirst } from 'lodash'
import { OutlineFilter } from 'pixi-filters'
import { DisplayObject, Texture } from 'pixi.js'
import { sworPartExplanations } from 'shared'
import { keys } from 'shared/code'
import type { InfoBoxDisplayArgs } from '.'
import { InfoBox } from '.'

// TODO calculate numbers live
export const keyTermsMap = {
    momentary:
        'After this card is played, remove it from your deck until the end of the room.',
    brittle:
        'Every time this card is played, remove a Brittle counter.\nIf this card has 0 Brittle counters, remove it from your deck permanently.',
    dwindle: 'costs +1 energy each use in room',

    orbsOfProtection: 'blocks for 50% of Magic',
    orbsOfLightning: 'deal 35% of Magic to all enemies',
    orbsOfFrost: '+1 Strongblock to party\n+1 Tired to enemies',
    orbsOfHolyLight:
        'Heals for 15% of Magic\nBlocks for 100% of Defense and 50% of Magic',

    berserk:
        '(aggressive stance only) deals 50% more damage, takes 100% more damage',
    bleed: 'This character takes unblockable damage equal to 5% of their maximum health at the start of its turn',
    brave: 'This character deals 15% more damage',
    courageous: 'This character deals 25% more damage',
    debilitated: 'This character deals 50% less damage',
    entranced: 'increases Magic by the number of entranced stacks',
    fatigued: 'This character deals 25% less damage',
    fire: 'This character receives Vulnerable (2) at start of its turn',
    fortified: 'This character receives 50% more block',
    guarded: 'This character receives 25% less damage',
    poisoned:
        'This character receives unblockable damage equal to the number of poison stacks it has at the start of its turn.',
    piercing: 'ignores block',
    reflect:
        'Deals damage up to the number of reflect stacks back to the attacker when taking a hit',
    mutuallyAssuredDestruction:
        'For every unblocked point of damage this character takes, deal 2 damage to the enemy that targeted them.',
    strongblock: 'Block this character gains is increased by 50%',
    stunned: 'This character cannot take an action this turn',
    targeted: 'receives 5 extra damage from every attack',
    tired: 'This character deals 12% less damage',
    unguarded: 'This character receives 25% more damage',
    unready: 'This character receives 12% more damage',
    vulnerable: 'This character receives 50% more damage',
    yodel: 'Enemies gain Brave(1) at the start of the next turn.',
    stamp: 'This characters strength is increased by 25',
    chargedBomb: 'Gnome Big Bomber has charged his bomb!',

    ...sworPartExplanations,
}

export type KeyTerm = keyof typeof keyTermsMap

export const TEXT_WIDTH = BASE_WIDTH * 0.18

export function getTermIndex(term: string, explanation: string): number {
    const lowerCaseTerm = startCase(term).toLowerCase()
    var re = new RegExp(`>${lowerCaseTerm}`, 'g')

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
            }),
            xOffset
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
            box.y = lastBox.y + lastBox.height + 10
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
        return portalizeExplanations(
            Container({}),
            [
                TermExplanation({
                    term,
                    displayObjectArgs: { x: xOffset, y: yOffset },
                }),
            ],
            xOffset
        )
    })
}

function portalizeExplanations(
    root: PixiContainer<DisplayObject>,
    content: PixiContainer[],
    xOffset: number
) {
    nextFrame().then(() => {
        nextFrame().then(() => {
            if (root == null || root.parent == null) return

            if (targetUidsWaitingForImpact.val.length) return

            let { x, y } = root.getGlobalPosition()
            content.forEach(item => {
                if (item.width + x + xOffset > BASE_WIDTH) {
                    x -= item.width + xOffset + 25
                } else if (x + xOffset < 0) {
                    x = -xOffset + 20
                }
            })

            portalize({
                from: root,
                content: Container(
                    {
                        x,
                        y,
                        name: 'explanation box',
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
    displayArgs,
}: {
    isShown: Datum<boolean>
    texts: string[] | (() => string[])
    xOffset?: number
    yOffset?: number
    isHtml?: boolean
    displayArgs?: DisplayObjectArgs | (() => DisplayObjectArgs)
}): PixiContainer {
    return If(
        isShown,
        () => {
            return portalizeExplanations(
                Container({}),
                [
                    Explanation({
                        texts: typeof texts === 'function' ? texts() : texts,
                        isHtml,
                        displayObjectArgs: {
                            borderThickness: 2,
                            padding: 10,
                            x: xOffset,
                            y: yOffset,
                            ...(displayArgs
                                ? typeof displayArgs === 'function'
                                    ? { ...displayArgs() }
                                    : { ...displayArgs }
                                : {}),
                        },
                    }),
                ],
                xOffset
            )
        },
        undefined
    )
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
            text: upperFirst(text),
            isHtml,
            style: {
                fill: index === 0 ? 'white' : 0xdddddd,
                wordWrapWidth: TEXT_WIDTH,
                wordWrap: true,
                /** @TODO upgrade pixijs to ^7.1.0 so we can use custom fonts with PixiHTMLText */
                fontFamily: 'Tahoma',
                // fontFamily:
                //     index === 0
                //         ? 'bigFont'
                //         : 'sansFont',
                fontWeight: texts.length > 1 && index === 0 ? 'bold' : '400',
                fontSize: index === 0 ? 22 : 18,
                fontStyle: 'normal',
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

    const outlineFilter = new OutlineFilter(
        3,
        displayObjectArgs?.borderColor ?? 0x1f2633
    )

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
            ...(displayObjectArgs ?? {}),
            ...(color
                ? { colorStops: [{ color, offset: 0 }] }
                : { colorStops: [{ color: 0x364259, offset: 0 }] }),
            padding: 15,
            borderThickness: 0,
            alpha: 0.96,
            filters: [outlineFilter],
        }
    )
}

function ElToSprite(el: DisplayObject) {
    return Sprite({ src: getRenderer().generateTexture(el) })
}
