import type { Card, CharacterUid } from '@shared'
import * as angu from 'angu'

import type { BattleCursor } from '@/util'

// import { vals } from '@/util'
import { explain as explainDeal } from './cardActions/deal'
import { s } from './cardActions/util/explainHelpers'

type AnguV = angu.Value

const standardOperators = {
    '-': (a: AnguV, b: AnguV) => a.eval() - b.eval(),
    '+': (a: AnguV, b: AnguV) => a.eval() + b.eval(),
    '/': (a: AnguV, b: AnguV) => a.eval() / b.eval(),
    '*': (a: AnguV, b: AnguV) => a.eval() * b.eval(),

    ';': (a: AnguV, b: AnguV) => {
        a.eval()
        return b.eval()
    },
    PI: 3.14,
}
export function explainActions(actions: string, locals?: object) {
    const actionsMap = {
        chain: (...chain: AnguV[]) => {
            return chain.map(link => link.eval()).join('\n')
        },
        deal: explainDeal,
        debilitate: (a: AnguV) => {
            const n = a.eval()
            return `debilitates for ${n} round${s(n)}`
        },
    }

    const ctx: angu.Context = {
        scope: {
            '=': function (a: AnguV, b: AnguV) {
                const resB = b.eval()
                if (a.kind() === 'variable') {
                    this.context.scope[a.name()] = resB
                } else {
                    throw Error(
                        `Assignment expected a variable on the left but got a ${a.kind()}`
                    )
                }
                return resB
            },
            ...standardOperators,
            ...actionsMap,
        },
        precedence: [['-', '+'], ['='], ['chain', 'deal', 'debilitate'], [';']],
    }

    // Now, we can evaluate things in this context:
    return angu.evaluate(actions, ctx, locals).value
}

export function interpretActions({
    card,
    targetUids,
    scene,
}: {
    card: Card
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    const cardOwner = scene.get('allCharacters', card.characterUid)
    console.log(
        explainActions(card.actions, {
            strength: cardOwner.strength,
            dexterity: cardOwner.dexterity,
            magic: cardOwner.magic,
            constitution: cardOwner.constitution,
        })
    )
}

// function getLivingNpcUid(scene: BattleCursor): CharacterUid {
//     return getCharIds(vals(scene.get('allCharacters')), { isPc: false })[0]
// }
