import type { DisplayObject } from 'pixi.js'
import { startCase } from 'lodash'
import type { InfoBoxDisplayArgs } from '.'
import { InfoBox } from '.'
import type { DisplayObjectArgs, PixiContainer } from '@/elementsUtil'
import {
    getRenderer,
    Sprite,
    Text,
    BASE_WIDTH,
    Container,
} from '@/elementsUtil'
import { keys } from 'shared/code'

export const keyTermsMap = {
    mimicAttack: 'deals 999 or copies the last hit taken this turn.',
    infectiousBite: 'unblocked damage becomes Poison',
    grudge: 'intentGrudge',

    momentary: 'removed until end of room',
    dwindle: 'costs +1 energy each use in room',

    fatigue: 'deals 25% less damage',
    courageous: 'deals 15% more damage',
    debilitated: 'deals 50% less damage',
    unready: 'receives 12% more damage',
    unguarded: 'receives 25% more damage',
    vulnerable: 'receives 50% more damage',
    bleed: '(unblockable) receives damage equal to 5% of max Health at start of turn',
    poison: '(unblockable) receives 1 damage per stack',
    stunned: 'cannot take an action this turn',
    targeted: 'receives 15% more damage',
    guarded: 'receives 25% more block',
    fortified: 'receives 50% more block',
    berserk:
        '(aggressive stance only) gains 50% strength, takes 100% more damage',
    strongblock: 'receives 50% more block',
    trance: 'increase magic stat by 11% times the number of counters',
    orbsOfProtection: 'blocks for 50% of Magic',
    orbsOfLightning: 'deals 35% of Magic to all enemies',
    orbsOfFrost: '+2 Strongblock',
    orbsOfHolyLight: 'heals for 12% of Magic\nblocks for 50% of Defense',
}

export type KeyTerm = keyof typeof keyTermsMap

export function getTermIndex(term: string, explanation: string): number {
    return explanation
        .toLowerCase()
        .indexOf(' ' + startCase(term).toLowerCase())
}

export function TermExplanationBoxes({
    terms,
    displayObjectArgs,
}: {
    terms: KeyTerm[]
    displayObjectArgs?: DisplayObjectArgs
}): PixiContainer[] {
    const termBoxes = terms.map(term =>
        TermExplanationBox({ term, displayObjectArgs })
    )

    const subTermBoxes = keys(keyTermsMap)
        .filter(term => ~getTermIndex(term, keyTermsMap[term]))
        .map(term => TermExplanationBox({ term, displayObjectArgs }))

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

export function TermExplanationBox({
    term,
    displayObjectArgs,
}: {
    term: KeyTerm
    displayObjectArgs?: DisplayObjectArgs
}): PixiContainer {
    return ExplanationBox({
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

export function ExplanationBox({
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
