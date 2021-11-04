
import type { RulebookAction } from '@shared'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'

import { resetRulebook, setRulebook } from '@/rulebook/rulebook'
import { getRulebookPairs, hashCode, prefix, toPath, updateClientRulebook, updateRulebookNames } from '@/util'

function updateClient() {
    updateRulebookNames()
    updateClientRulebook()
}
export const rulebookAction: RulebookAction = args => {
    logger.info(`rulebookAction performing action ${args.do}`)
    if (!existsSync(prefix)) { mkdirSync(prefix) }
    switch (args.do) {
        case 'choose': {
            logger.info(`choosing rulebook ${args.id}`)
            if (args.id === 'default') {
                resetRulebook()
                updateClient()
                return
            }
            const p = toPath(args.id)
            if (!existsSync(p)) {
                throw Error('chosen rulebook does not exist')
            }
            setRulebook(JSON.parse(readFileSync(p, 'utf-8')))
            updateClient()
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
            updateClient()
            return
        }
        case 'new': {
            const newName = args.rulebook.name
            if (newName === 'default') {
                throw Error('cannot name rulebook \'default\'')
            }
            const s = JSON.stringify(args.rulebook)
            const id = hashCode(s).toString()
            const p = toPath(id)
            logger.info(`creating rulebook ${id}`)
            if (existsSync(p)) {
                throw Error('same exact rulebook already exists')
            }
            // TODO: put name into filename
            const curPairs = getRulebookPairs()
            if (curPairs?.find(p => p.name === newName)) {
                throw Error('same-named rulebook already exists')
            }
            writeFileSync(p, s)
            setRulebook(args.rulebook)
            updateClient()
            return
        }
        default: {
            throw Error('unknown arg type')
        }
    }
}
