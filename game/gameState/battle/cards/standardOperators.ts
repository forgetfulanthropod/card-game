import type { Value as VAngu } from 'angu'
import { assertFinite } from 'shared/code'

type ANum = VAngu<number>

function process(av: ANum, bv: ANum) {
    const [a, b] = [av.eval(), bv.eval()]
    assertFinite({ a, b })
    return [a, b]
}

export const standardOperators = {
    '-': (av: ANum, bv: ANum) => {
        const [a, b] = process(av, bv)
        return a - b
    },
    '+': (av: ANum, bv: ANum) => {
        const [a, b] = process(av, bv)
        return a + b
    },
    '/': (av: ANum, bv: ANum) => {
        const [a, b] = process(av, bv)
        return a / b
    },
    '*': (av: ANum, bv: ANum) => {
        const [a, b] = process(av, bv)
        return a * b
    },
    '<': (av: ANum, bv: ANum) => {
        const [a, b] = process(av, bv)
        return a < b
    },

    ';': (a: VAngu, b: VAngu) => {
        a.eval()
        return b.eval()
    },
} as const
