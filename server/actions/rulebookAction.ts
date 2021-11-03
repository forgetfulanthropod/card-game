
import type { RulebookAction } from '@shared'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'

import { resetRulebook } from '@/rulebook/rulebook'
import { hashCode, prefix, toPath, updateRulebookNames } from '@/util'

export const rulebookAction: RulebookAction = args => {
    if (!existsSync(prefix)) { mkdirSync(prefix) }
    switch (args.do) {
        case 'choose': {
            if (args.id === 'default') { resetRulebook() }
            if (!existsSync(toPath(args.id))) {
                throw Error('')
            }
            return
        }
        case 'delete': {
            if (args.id === 'default') { throw Error('cannot delete default rulebook') }
            const p = toPath(args.id)
            if (!existsSync(p)) {
                throw Error('rulebook file does not exist')
            }
            rmSync(p)
            updateRulebookNames()
            return
        }
        case 'new': {
            const s = JSON.stringify(args.rulebook)
            const p = toPath(hashCode(s).toString())
            if (existsSync(p)) {
                throw Error('same rulebook already exists')
            }
            writeFileSync(p, s)
            updateRulebookNames()
            return
        }
        default: {
            throw Error('unknown arg type')
        }
    }
}
