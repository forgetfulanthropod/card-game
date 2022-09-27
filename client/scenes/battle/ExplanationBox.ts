import type { DisplayObject } from 'pixi.js'
import { startCase } from 'lodash'
import { InfoBox } from '../shared'
import type { DisplayObjectArgs } from '@/elementsUtil'
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
}

export type KeyTerm = keyof typeof keyTermsMap

export function TermExplanationBox({
    term,
    displayObjectArgs,
}: {
    term: KeyTerm
    displayObjectArgs: DisplayObjectArgs
}): DisplayObject {
    return ExplanationBox({
        // text: `<div style="font-family: sans-serif">
        //     <b>${startCase(term)}</b>
        //     <br/>
        //     ${keyTermsMap[term]}
        // </div>`,
        text: `${startCase(term)}\n${keyTermsMap[term]}`,
        displayObjectArgs,
    })
}

export function ExplanationBox({
    text,
    displayObjectArgs,
}: {
    text: string
    displayObjectArgs: DisplayObjectArgs
}): DisplayObject {
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
        Container(
            {},
            ElToSprite(
                Text({
                    text,
                    // isHtml: true,
                    style: {
                        fill: 'white',
                        wordWrapWidth: BASE_WIDTH * 0.2,
                        wordWrap: true,
                    },
                    anchor: [0.5, 0],
                })
            )
        ),
        {
            ...displayObjectArgs,
            padding: 25,
        }
    )
}

function ElToSprite(el: DisplayObject) {
    return Sprite({ src: getRenderer().generateTexture(el) })
}
