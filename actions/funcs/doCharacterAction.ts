import type { AttackData } from '@shared'

import {
    checkWinner,
    doNpcMove,
    getDefenders,
    getLivingChars,
    getTransformed,
    handleMove,
    isSpecial,
    log,
    tl,
    warn,
} from '@/gameState/battle'
import { getBattleScene, onCallWrapper, sleep, vals } from '@/util'

import { NOT_YOUR_TURN_REJECTION_WAIT } from './startGame'


export default onCallWrapper(
    async function doCharacterAction({ uid: clickedUid }: { uid: string }): Promise<void> {
        const scene = getBattleScene('alice')
        const { allCharacters, isPlayerTurn, selectedCharacter, selectedMove } = scene.get()
        log('received click for ' + clickedUid)
        const clicked = allCharacters[clickedUid]
        const { alivePcs } = getLivingChars(allCharacters)
        if (checkWinner(vals(allCharacters)) != null) {
            warn('winner exists')
            return
        }
        if (!isPlayerTurn) {
            warn('not player turn')
            if (!scene.getK('isPlayerTurn')) {
                await sleep(NOT_YOUR_TURN_REJECTION_WAIT)
                await doNpcMove('NPC has extra turns')
            }
            return
        }
        if (alivePcs.every(c => c.hasMoved)) {
            warn('no unmoved pcs')
            return
        }
        // click to choose selected Pc:
        if (clicked.isPc) {
            if (clicked.hasMoved) {
                warn('selected char has already attacked')
                return
            }
            scene.setK('selectedCharacter', clicked.uid)
            return
        }

        // clicked on NPC but no selected character
        if (!selectedCharacter || allCharacters[selectedCharacter].hasMoved) {
            // should be unreachable
            tl('select attacker first')
            return
        }
        if (selectedMove == null) {
            // should be unreachable
            tl('select move first')
            return
        }

        let move = selectedMove
        if (isSpecial(move))
            move = getTransformed(move, selectedCharacter)

        const ad: AttackData = {
            attacker: allCharacters[selectedCharacter],
            defenders: getDefenders(clicked, move, vals(allCharacters)),
            move,
        }
        await handleMove(scene, allCharacters, ad)
    }
)
