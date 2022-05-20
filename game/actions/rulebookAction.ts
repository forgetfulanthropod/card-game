import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import type { GameActions } from '@serverActions'

import { resetRulebook, setRulebook } from '@/rulebook'
import { pacificDate, prefix, stringifyRulebook, toPath } from '@/util'

export const rulebookAction: GameActions['RulebookAction'] = args => {
    logger.info(`rulebookAction performing action ${args.do}`)
    if (!existsSync(prefix)) {
        mkdirSync(prefix)
    }
    switch (args.do) {
        case 'choose': {
            logger.info(`choosing rulebook ${args.name}`)
            if (args.name === 'default') {
                resetRulebook()
                // updateClientRulebookData(args.username)
                return
            }
            const p = toPath(args.name)
            if (!existsSync(p)) {
                throw Error('chosen rulebook does not exist')
            }
            setRulebook(JSON.parse(readFileSync(p, 'utf-8')))
            // updateClientRulebookData(args.username)
            return
        }
        case 'delete': {
            logger.info(`deleting rulebook ${args.name}`)
            if (args.name === 'default') {
                throw Error('cannot delete default rulebook')
            }
            const p = toPath(args.name)
            if (!existsSync(p)) {
                throw Error('delete attempt: rulebook file does not exist')
            }
            rmSync(p)
            resetRulebook()
            // updateClientRulebookData(args.username)
            return
        }
        case 'new': {
            const newName = args.rulebook.name
            if (newName === 'default') {
                throw Error("cannot name rulebook 'default'")
            }
            const rulebook = { ...args.rulebook, savedAt: pacificDate() }
            const s = stringifyRulebook(rulebook)
            const p = toPath(newName)
            logger.info(`creating rulebook ${newName}`)
            if (existsSync(p)) {
                throw Error(`rulebook with name ${newName} already exists`)
            }
            writeFileSync(p, s, { encoding: 'utf-8' })
            // json-parsing ensures good key order:
            setRulebook(JSON.parse(s))
            // updateClientRulebookData(args.username)
            return
        }
        default: {
            throw Error('unknown arg type')
        }
    }
}
