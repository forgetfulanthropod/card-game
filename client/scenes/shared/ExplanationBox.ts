import type { DisplayObject } from 'pixi.js'
import { startCase } from 'lodash'
import { InfoBox } from '.'
import type { DisplayObjectArgs, PixiContainer } from '@/elementsUtil'
import {
    getRenderer,
    Sprite,
    Text,
    BASE_WIDTH,
    Container,
} from '@/elementsUtil'

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
    trance: 'increase magic stat by 11%  the number of counters it currently has.',
}

export type KeyTerm = keyof typeof keyTermsMap

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
        texts: [`${startCase(term)}`, `${keyTermsMap[term]}`],
        displayObjectArgs,
    })
}

export function ExplanationBox({
    texts,
    color,
    displayObjectArgs,
}: {
    texts: string[]
    color?: number
    displayObjectArgs?: DisplayObjectArgs
}): PixiContainer {
    const textEls = texts.map((text, index) => {
        return ElToSprite(
            Text({
                text,
                // isHtml: true,
                style: {
                    fill: 'white',
                    wordWrapWidth: BASE_WIDTH * 0.2,
                    wordWrap: true,
                    fontWeight:
                        texts.length > 1 && index === 0 ? 'bold' : '400',
                },
                anchor: [0.5, 0],
            })
        )
    })

    textEls.forEach((el, index) => {
        if (index > 0) {
            const lastEl = textEls[index - 1]
            el.y = lastEl.y + lastEl.height
        }
    })

    return InfoBox(
        // RoundedBordered(
        //     Sprite({
        //         src: Text({
        //             text: plushyChoiceDescriptions[index],
        //             style: {
        //                 fill: 'white',
        //                 wordWrapWidth: BASE_WIDTH * 0.2,
        //                 wordWrap: true,
        //             },
        //         }).texture,
        //     }),
        //     { radius: 10, borderColor: 0xffffff, borderThickness: 2 }
        // ),
        Container({}, ...textEls),
        {
            ...(displayObjectArgs ?? {}),
            padding: 25,
            ...(color ? { colorStops: [{ color, offset: 0 }] } : {}),
        }
    )
}

function ElToSprite(el: DisplayObject) {
    return Sprite({ src: getRenderer().generateTexture(el) })
}
