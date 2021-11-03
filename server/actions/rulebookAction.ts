
import type { RulebookAction } from '@shared'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'

import { resetRulebook, setRulebook } from '@/rulebook/rulebook'
import { hashCode, prefix, toPath, updateClientRulebook, updateRulebookNames } from '@/util'

export const rulebookAction: RulebookAction = args => {
    logger.info(`rulebookAction performing action ${args.do}`)
    if (!existsSync(prefix)) { mkdirSync(prefix) }
    switch (args.do) {
        case 'choose': {
            logger.info(`choosing rulebook ${args.id}`)
            if (args.id === 'default') { resetRulebook() }
            const p = toPath(args.id)
            if (!existsSync(p)) {
                throw Error('chosen rulebook does not exist')
            }
            setRulebook(JSON.parse(readFileSync(p, 'utf-8')))
            updateRulebookNames()
            updateClientRulebook()
            return
        }
        case 'delete': {
            logger.info(`deleting rulebook ${args.id}`)
            if (args.id === 'default') { throw Error('cannot delete default rulebook') }
            const p = toPath(args.id)
            if (!existsSync(p)) {
                throw Error('delete attempt: rulebook file does not exist')
            }
            rmSync(p)
            resetRulebook()
            updateRulebookNames()
            updateClientRulebook()
            return
        }
        case 'new': {
            const s = JSON.stringify(args.rulebook)
            const id = hashCode(s).toString()
            const p = toPath(id)
            logger.info(`creating rulebook ${id}`)
            if (existsSync(p)) {
                throw Error('same rulebook already exists')
            }
            writeFileSync(p, s)
            setRulebook(args.rulebook)
            updateRulebookNames()
            updateClientRulebook()
            return
        }
        default: {
            throw Error('unknown arg type')
        }
    }
}
