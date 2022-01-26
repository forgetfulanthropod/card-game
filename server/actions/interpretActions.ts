import type { Card } from '@shared'
import * as angu from 'angu'

import type { BattleCursor } from '@/util'

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
        deal: (damage: AnguV, times: AnguV) => {
            let explication = 'deals ' + damage.eval() + ' damage'

            if (times != null) {
                const n = times.eval()
                explication += ` ${n} time${s(n)}`
            }

            return explication
        },
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
    card = null,
    scene = null,
}: {
    card?: Card | null
    scene?: BattleCursor | null
}) {
    void card
    void scene

    // assert.equal(r1.value, 42)
    // const r2 = angu.evaluate('10 + 4 / 2 * 3', ctx)
    // assert.equal(r2.value, 16)
    // const r3 = angu.evaluate('PI * 2', ctx)
    // assert.equal(r3.value, 6.28)
}

function s(n: number) {
    return n > 1 ? 's' : ''
}
