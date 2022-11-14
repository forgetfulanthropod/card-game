import type { DisplayObject } from 'pixi.js'
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
import { nextTick } from '@/util'

export const keyTermsMap = {
    momentary: 'removed until end of room',
    dwindle: 'costs +1 energy each use in room',

    orbsOfProtection: 'blocks for 50% of Magic',
    orbsOfLightning: 'deals 35% of Magic to all enemies',
    orbsOfFrost: '+1 Strongblock to party\n+1 Tired to enemies',
    orbsOfHolyLight: 'heals for 12% of Magic\nblocks for 50% of Defense',

    grudge: 'intentGrudge',
    infectiousBite: 'unblocked damage becomes Poison',
    mimicAttack: 'deals 999 or copies the last hit taken this turn.',

    berserk:
        '(aggressive stance only) gains 50% strength, takes 100% more damage',
    bleed: '(unblockable) receives damage equal to 5% of max Health at start of turn',
    courageous: 'deals 15% more damage',
    debilitated: 'deals 50% less damage',
    entranced: 'increase magic stat by 11% times the number of counters',
    fatigued: 'deals 25% less damage',
    fortified: 'receives 50% more block',
    guarded: 'receives 25% more block',
    poisoned: '(unblockable) receives 1 damage per stack',
    strongblock: 'receives 50% more block',
    stunned: 'cannot take an action this turn',
    targeted: 'receives 15% more damage',
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
    return If(areShown, () => {
        const root = Container({})

        nextTick().then(() =>
            portalize({
                from: root,
                to: () => getStage(),
                content: Container(
                    {},
                    ...TermExplanations({
                        terms,
                        displayObjectArgs: {
                            x: root.getGlobalPosition().x + xOffset,
                            y: root.getGlobalPosition().y + yOffset,
                        },
                    })
                ),
            })
        )

        return root
    })
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
        const root = Container({})

        nextTick().then(() =>
            portalize({
                from: root,
                to: () => getStage(),
                content: TermExplanation({
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

export function TermExplanation({
    term,
    displayObjectArgs,
}: {
    term: KeyTerm
    displayObjectArgs?: DisplayObjectArgs
}): PixiContainer {
    return Explanation({
        // text: `<div style="font-family: sans-serif">
        //     <b>${startCase(term)}</b>
        //     <br/>
        //     ${keyTermsMap[term]}
        // </div>`,
        texts: [
            `${startCase(term)}`.replace('Orbs', 'Orb'),
            `${keyTermsMap[term]}`,
        ],
        displayObjectArgs: {
            ...displayObjectArgs,
            borderThickness: 3,
        },
    })
}

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
                content: Explanation({
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

export function Explanation({
    texts,
    color,
    displayObjectArgs,
}: {
    texts: string[]
    color?: number
    displayObjectArgs?: InfoBoxDisplayArgs
}): PixiContainer {
    const textEls = texts.map((text, index) => {
        return Text({
            text,
            // isHtml: true,
            style: {
                fill: 'white',
                wordWrapWidth: BASE_WIDTH * 0.2,
                wordWrap: true,
                fontWeight: texts.length > 1 && index === 0 ? 'bold' : '400',
                fontSize: displayObjectArgs?.fontSize ?? 20,
            },
        })
    })

    textEls.forEach((el, index) => {
        if (index > 0) {
            const lastEl = textEls[index - 1]
            el.y = lastEl.y + lastEl.height + 5
        }
    })

    return InfoBox(Container({}, ...textEls), {
        ...(displayObjectArgs ?? {}),
        padding: 25,
        ...(color ? { colorStops: [{ color, offset: 0 }] } : {}),
    })
}

function ElToSprite(el: DisplayObject) {
    return Sprite({ src: getRenderer().generateTexture(el) })
}
